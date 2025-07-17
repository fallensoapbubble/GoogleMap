import { useNavigate } from 'react-router-dom';

const Errorz = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
            <h1>Oops! Something went wrong.</h1>
            <p>Please click the button below to go back to the home page.</p>
            <button
                onClick={() => navigate('/')}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Go Back to Home
            </button>
        </div>
    );
};

export default Errorz;