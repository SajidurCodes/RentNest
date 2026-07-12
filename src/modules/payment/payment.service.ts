

import config from "../../config";
import { ICreatePaymentPayload } from "./payment.interface";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../lib/stripe";






const createPayment = async (payload: ICreatePaymentPayload,user: {id: string;email: string;}) => {

    const { rentalRequestId } = payload;

    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: rentalRequestId
        },
        include: {
            property: true
        }
    });

    if (!rentalRequest) {
        throw new Error("Rental request not found.");
    }


    if (rentalRequest.tenantId !== user.id) {
        throw new Error("You are not allowed to pay for this rental request!!");
    }

   
    if (rentalRequest.status !== RentalStatus.APPROVED) {
        throw new Error("Rental request is not approved yet!!!😔😔😔");
    }


    if (!rentalRequest.property.isAvailable) {
        throw new Error("Property is no longer available!!!😔😔");
    }

    




    const completedPayment = await prisma.payment.findFirst({
        where: {
            rentalRequestId,
            status: PaymentStatus.COMPLETED
        }
    });

    if (completedPayment) {
        throw new Error("Payment has already been completed!!!!!!!!");
    }


    await prisma.payment.deleteMany({
        where: {
            rentalRequestId,
            status: PaymentStatus.PENDING
        }
    });



    const amount = Math.round(rentalRequest.property.rentAmount);

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: user.email,
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: rentalRequest.property.title,
                        description: `Rental Payment`
                    },
                    unit_amount: amount
                },
                quantity: 1
            }
        ],
        metadata: {
            rentalRequestId,
            tenantId: user.id
        },
        success_url: `${config.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/payment-cancel`

    });

   

    const payment = await prisma.payment.create({

        data: {
            tenantId: user.id,
            rentalRequestId,
            amount: rentalRequest.property.rentAmount,
            transactionId: session.id,
            status: PaymentStatus.PENDING
        }
    });

    return {paymentUrl: session.url,payment};

};


const getMyPayments = async (tenantId: string) => {
    
    const payments = await prisma.payment.findMany({
        where: {
            tenantId: tenantId, 
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    
    return {
        data: payments,
        meta: {
            total: payments.length
        }
    };
};

const getPaymentById = async (paymentId: string, tenantId: string) => {
    const payment = await prisma.payment.findFirst({
        where: {
            id: paymentId,
            tenantId: tenantId,
        },
    });

    if (!payment) {
        throw new Error("Payment record not found! 😔");
    }

    return payment;
};

const webhook = async (payload: Buffer,signature: string) => {

    const endpointSecret = config.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(payload,signature,endpointSecret);

    switch (event.type) {

        case "checkout.session.completed":

            await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
            break;

    }

};


const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {

    const rentalRequestId = session.metadata?.rentalRequestId;

    if (!rentalRequestId) {
        throw new Error("Rental Request Id not found!!!!!!!😔😔😔");
    };



    const payment=await prisma.payment.findFirst({
        where: {
            transactionId: session.id
        }
    });


    if (!payment) {
        throw new Error("Payment not found.");
    }

    if (payment.status === PaymentStatus.COMPLETED) {
        return;
    }


    
    await prisma.$transaction(async (tx) => {
        await tx.payment.update({
            where: {
                id: payment.id
            },
            data: {
                status: PaymentStatus.COMPLETED,
                paidAt: new Date()
            }
        });

        // update to make active
        await tx.rentalRequest.update({
            where: {
                id: rentalRequestId
            },
            data: {
                status: RentalStatus.ACTIVE
            }
        });

        const rental = await tx.rentalRequest.findUnique({
            where: {
                id: rentalRequestId
            }
        });



        if (!rental) {
            throw new Error("Rental Request not found!!!!!!!😔😔😔");
        }
        // property available false 
        await tx.property.update({
            where: {
                id: rental.propertyId
            },
            data: {
                isAvailable: false
            }
        });
        //Baki shob reject
        await tx.rentalRequest.updateMany({
            where: {
                propertyId: rental.propertyId,
                status: RentalStatus.PENDING,
                NOT: {
                    id: rentalRequestId
                }
            },
            data: {
                status: RentalStatus.REJECTED
            }
        });
    });

};


export const paymentService = {
    createPayment,
    webhook,
    getMyPayments,
    getPaymentById
};
