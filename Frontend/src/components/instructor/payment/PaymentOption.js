import { useCreditCardValidator, images } from 'react-creditcard-validator';
import { useState } from 'react';
import "../../../Assets/validater.scss"
import { IoMdClose } from 'react-icons/io';
import { createAny } from '../../../api/instructorAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unsuscribeTeacher, unsuscribeToken } from '../../../store/store';
import { googleLogout } from '@react-oauth/google';

const PaymentOption = (props) => {
    
    const [cardstate, setcardState] = useState({
        nameOnCard: '',
        
    });
    function expDateValidate(month, year) {
        if (Number(year) > 2035) {
            return 'Expiry Date Year cannot be greater than 2035';
        }
        return;
    }

    const token = useSelector((state) => state.token);

    const {
        getCardNumberProps,
        getCardImageProps,
        getCVCProps,
        getExpiryDateProps,
        meta: { erroredInputs }
    } = useCreditCardValidator({ expiryDateValidator: expDateValidate });

    const navigate =useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = ()=>{
        createAny(`set-payment`,cardstate,token)
        .then((res)=>{
            props.close()
        }).catch((err)=>{
            if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                localStorage.removeItem("teacherToken");
                dispatch(unsuscribeToken());
                localStorage.removeItem("teacherData");
                dispatch(unsuscribeTeacher());
                navigate("/instructor");
                googleLogout();
              }
        })
        
    }
    

    return (
        <div className="z-30 modal-local p-4">
            <div className="modal-local-content-pay rounded">
                <div className="modal-local-header flex justify-between">
                    <h4 className="modal-local-title text-center font-bold text-xl">
                        Register
                    </h4>
                    <button onClick={()=>props.close()}><IoMdClose color="red" size="25px" /></button>
                </div>
                <div className="modal-local-body-pay">
                    <main className='flex flex-col justify-center items-center'>
                        <h1 className='my-3 '>Enter your card Details</h1>
                        <div className="input-group-local">
                            <label>Name on Card</label>
                            <input
                                value={cardstate.nameOnCard}
                                onChange={(e) => setcardState({ ...cardstate, nameOnCard: e.target.value })}
                            />

                        </div>

                        <div className="input-group-local">
                            <svg {...getCardImageProps({ images })} />
                            <label>Card Number</label>
                            <input
                                {...getCardNumberProps({
                                    onChange: (e) =>
                                        setcardState({
                                            ...cardstate,
                                            [e.target.name]: e.target.value
                                        })
                                })}
                            />
                        </div>
                        <small>{erroredInputs.cardNumber && erroredInputs.cardNumber}</small>


                        <div className="multi-input-local">
                            <div className="input-group-local">
                                <label>Valid Till</label>
                                <input
                                    {...getExpiryDateProps({
                                        onChange: (e) =>
                                            setcardState({
                                                ...cardstate,
                                                [e.target.name]: e.target.value
                                            })
                                    })}
                                />
                                <small>{erroredInputs.expiryDate && erroredInputs.expiryDate}</small>
                            </div>

                            <div className="input-group-local">
                                <label>CVC</label>
                                <input
                                    {...getCVCProps({
                                        onChange: (e) =>
                                            setcardState({
                                                ...cardstate,
                                                [e.target.name]: e.target.value
                                            })
                                    })}
                                />
                                <small>{erroredInputs.cvc && erroredInputs.cvc}</small>
                            </div>

                        </div>

                        <button
                            onClick={handleSubmit}
                            className='bg-black p-2 rounded text-white'
                        >
                            Save
                        </button>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PaymentOption;
