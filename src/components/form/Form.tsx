import React, { useEffect, useRef, useState } from "react";
import {FormData, ResponseState, validData} from "../../interface/interface";
import requestData from "../../service/fetch";
import './style.scss'

const Form = () => {

    const [fullName, setfullName] = useState<string>(''),
        [email, setEmail] = useState<string>(''),
        [phone, setPhone] = useState<string>('+7'),
        [date, setDate] = useState(''),
        [messages, setMessage] = useState<string>(''),
        [pending, setPending] = useState<boolean>(),
        [response, setResponse] = useState<
            ResponseState
            >
        ({
            message: '',
        });

        const [valiDateFullName, setValidateFullName,] = useState<validData>({
                isError: false,
                errorMessage: ''
            })
        const [valiDateEmail, setValidateEmail] = useState<validData>({
            isError: false,
            errorMessage: ''
        })
        const [valiDatePhone, setValidatePhone] = useState<validData>({
            isError: false,
            errorMessage: ''
        })
        const [valiDateDate, setValidateDate] = useState<validData>({
            isError: false,
            errorMessage: ''
        })
        const [valiDateMessage, setValidateMessage] = useState<validData>({
            isError: false,
            errorMessage: ''
        })


        // function validate validateInputs
        const validateInputs = (value: string): void => {
            
            if(value == fullName) {  
                if (/[а-я]/i.test(fullName.toLocaleLowerCase())) {
                    setValidateFullName(
                        {isError: true,
                        errorMessage: 'Для корректного заполнения используйте, буквы латинского алфавита'
                        }
                    );
                }   else if (fullName.indexOf(' ') === -1) {
                    setValidateFullName(
                        {isError: true,
                        errorMessage: 'Между именем и фамилией используйте пробел'
                        }
                    );
                }   else if (fullName.length > 0  && fullName.length < 3) {
                        setValidateFullName(
                            {isError: true,
                            errorMessage: 'Длина символов от 3 до 30'
                            }
                        );
                } else if (fullName.split(' ').length > 2) {
                        setValidateFullName(
                            {isError: true,
                            errorMessage: 'Между именем и фамилией используйте одиночный пробелы либо удалите пробелы вне'
                            }
                        );
                }   else {
                        setValidateFullName(
                            {isError: false,
                            errorMessage: ''
                            }
                        );
                }
            } else if (value == email) {
                console.log('rmail')
                const reg =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
                if(!reg.test(String(email).toLocaleLowerCase())) {
                    setValidateEmail({
                        isError: true,
                        errorMessage: 'Введите валидный Email'
                    })
                } else {
                    setValidateEmail({
                        isError: false,
                        errorMessage: ''
                    })
                }
            } else if (value == phone) {
                let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
                
                if(!regex.test(phone) && phone.length > 2){
                    setValidatePhone({
                        isError: true,
                        errorMessage: 'Введите валидный номер телефона'
                    })
                }   else{
                    setValidatePhone({
                        isError: false,
                        errorMessage: ''
                    })
                }
            } else if (value == messages) {
                console.log('kk')
                if(messages.length < 10) {
                    
                    setValidateMessage({
                        isError: true,
                        errorMessage: 'Собщение должно быть больше 10 символов'
                    })
                } else if (messages.length > 300) {
                    setValidateMessage({
                        isError: true,
                        errorMessage: 'Собщение должно быть менее 300 символов'
                    })
                } else {
                    setValidateMessage({
                        isError: false,
                        errorMessage: ''
                    })
                }
            }
        }
        useEffect(() => {
            if(prevFullName !== fullName && fullName !== '') {
                validateInputs(fullName);
            } else if (prevEmail !== email && email !== '') {
                validateInputs(email);
            } else if (prevPhone !== phone && phone !== '') {
                validateInputs(phone);
            } else if (prevMessages !== messages && messages !== '') {
                validateInputs(messages);
            } else {
                return;
            }
        }, [
            fullName,
            email,
            phone,
            messages,
        ]);

        const prevFullName = usePrevious(fullName);
        const prevEmail = usePrevious(email);
        const prevPhone = usePrevious(phone);
        const prevMessages = usePrevious(messages);
        // Hook
        function usePrevious(value: any): any {
            // The ref object is a generic container whose current property is mutable ...
            // ... and can hold any value, similar to an instance property on a class
            const ref = useRef();
            // Store current value in ref
            useEffect(() => {
            ref.current = value;
            }, [value]); // Only re-run if value changes
            // Return previous value (happens before update in useEffect above)
            return ref.current;
        }

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        if (fullName && email && phone && date && messages) {
            if (!valiDateFullName.isError && !valiDateEmail.isError && !valiDatePhone.isError && !valiDateDate.isError && !valiDateMessage.isError) {
                const data: FormData = {
                    fullName,
                    email,
                    phone,
                    date,
                    messages
                };
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                };
                requestData('https://jsonplaceholder.typicode.com/posts', requestOptions)
                .then((response) => {
                    if (response.status >= 200 && response.status <= 299) {
                        setPending(true);
                        const resJson = response.json();
                        return resJson;
                    } else {
                        setResponse({
                            message: `${response.status} что-то пошло не так`
                        })
                    }
                    
                })
                .then((resJson) => {
                    console.log(resJson)
                    setResponse({
                        message: `Данные отправлены`
                    })
                    setPending(false);
                })
                .catch((err) => {
                    setResponse({
                        message: `Что-то пошло не так`
                    })
                    setPending(false);
                    console.log(`Error in fetch ${err}`);
                })
            } else {
                setResponse({
                    message: `Заполните поля валидно`
                })
            }
        } else {
            setResponse({
                message: `Заполните поля`
            })
        }
    }
    return (  
        <>
            <form noValidate action="">
                <div className="wrapper-input">
                    <input name="fullName" className="input" type="text" value={fullName.toLocaleUpperCase()} onChange={(e) => setfullName(e.target.value)}/>
                    <p className={valiDateFullName.isError ? 'error active' : 'error'}>{valiDateFullName.isError ? valiDateFullName.errorMessage : null}</p>
                </div>
                <div className="wrapper-input">
                    <input name="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <p className={valiDateEmail.isError ? 'error active' : 'error'}>{valiDateEmail.isError ? valiDateEmail.errorMessage : null}</p>
                </div>
                 <div className="wrapper-input">
                    <input name="phone" className="input" type="text" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    <p className={valiDatePhone.isError ? 'error active' : 'error'}>{valiDatePhone.isError ? valiDatePhone.errorMessage : null}</p>
                </div>
                <div className="wrapper-input">
                    <input name="date" className="input" type="date"
                    value={date} onChange={(e) => setDate(e.target.value)}
                    />
                    <p className={valiDateDate.isError ? 'error active' : 'error'}>{valiDateDate.isError ? valiDateDate.errorMessage : null}</p>
                </div>
                <div className="wrapper-input">
                    <textarea value={messages} onChange={(e) => setMessage(e.target.value)} name="maessage" className="input" />
                    <p className={valiDateMessage.isError ? 'error active' : 'error'}>{valiDateMessage.isError ? valiDateMessage.errorMessage : null}</p> 
                </div>
                <button disabled={pending} onClick={onSubmit}>Send</button>
                <p className="">{response.message}</p>
            </form>
        </>
    );
}

export default Form;