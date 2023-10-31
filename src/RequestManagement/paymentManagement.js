import axios from 'axios';
import setReqHeader from './headerSetup';

// Function to add a new payment
export const addNewPayment = async (paymentData) => {
    try {
        setReqHeader();
        const response = await axios.post('/payment/add', {
            "data": paymentData
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Failed to add payment:", error);
        throw error;
    }
};

// Function to remove a payment
export const deletePayment = async (paymentId) => {
    try {
        setReqHeader();
        const response = await axios.delete(`/payment/remove/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete payment:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};

// Function to fetch all payments
export const getAllPayments = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/payment/list');
        const data = response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch the list of payments:", error);
        throw error;
    }
};

// Function to get students for a specific program's payments
export const getStudentsForProgramPayments = async (programId) => {
    try {
        setReqHeader();
        const response = await axios.get(`/payment/studentforprogram/${programId}`);
        const data = response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch students for program's payments:", error);
        throw error;
    }
};
