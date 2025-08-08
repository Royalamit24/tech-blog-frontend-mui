import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling

const ReactToastContainer = () => {
    return (
        <div>
            <ToastContainer
                position="top-right" // Set the position of the toast container
                autoClose={3000} // Set the duration for which to display each toast message
           />
        </div>
    )
}

export default ReactToastContainer;