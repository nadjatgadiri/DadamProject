import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

// Function to add a new payment
export const addNewPayment = async (paymentData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/payment/add', {
            "data": paymentData
        });
        const data = response.data;
        reloadOn501(data);
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
        const response = await axios.delete(`/protected/payment/remove/${paymentId}`);
        reloadOn501(response.data);
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
        const response = await axios.get('/protected/payment/list');
        const data = response.data;
        reloadOn501(data);
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
        const response = await axios.get(`/protected/payment/studentforprogram/${programId}`);
        const data = response.data;
        reloadOn501(data); return data;
    } catch (error) {
        console.error("Failed to fetch students for program's payments:", error);
        throw error;
    }
};
// Function to get total payments and payments in the last 30 days for a program
export const getPaymentsInfoForProgram = async (programId) => {
    try {
        setReqHeader();
        const response = await axios.get(`/protected/payment/stats/${programId}`);
        const data = response.data;
        reloadOn501(data); return data;
    } catch (error) {
        console.error("Failed to fetch payments information for the program:", error);
        throw error;
    }
};