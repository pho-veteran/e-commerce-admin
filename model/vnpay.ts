import { VNPay } from "vnpay";

const getVNPayModel = (tmnCode: string, secureSecret: string) => {
    const vnpay = new VNPay({
        tmnCode: tmnCode,
        secureSecret: secureSecret
    });

    return vnpay;
}
 
export default getVNPayModel;