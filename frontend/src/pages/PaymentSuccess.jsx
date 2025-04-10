import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { cleanCart, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const verify = async () => {
      const dataQuery = params.get("data");

      if (!dataQuery) {
        alert("Missing payment data.");
        navigate("/checkout");
        return;
      }

      try {
        console.log("dataQuery:", dataQuery);
        const resObject = JSON.parse(atob(dataQuery));
        console.log("Decoded object:", resObject);

        const res = await axios.post(`${backendUrl}/api/payment/verify`, {
          refId: resObject.transaction_code,
          transaction_uuid: resObject.transaction_uuid,
          amt: resObject.total_amount,
        });

        cleanCart();
        alert("✅ Payment successful and verified!");
        navigate("/orders");
      } catch (err) {
        console.error("Payment verification error:", err);
        alert("❌ Payment verification failed!");
        navigate("/checkout");
      }
    };

    verify();
  }, [params, navigate, backendUrl, cleanCart]);

  return <p className="text-center mt-10">Verifying payment, please wait...</p>;
};

export default PaymentSuccess;
