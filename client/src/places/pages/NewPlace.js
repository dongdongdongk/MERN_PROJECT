import React from "react";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from "../../shared/components/FormElements/Button";
import './PlaceForm.css'

const NewPlace = () => {
    const[formState,InputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            }
        }, false
    )

    const placeSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs); // 나중에 백엔드 추가 
    }


    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
                id="title"
                element='input'
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title"
                onInput={InputHandler}
            >
            </Input>
            <Input
                id="description"
                element='textarea'
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (at least 5 characters"
                onInput={InputHandler}
            >
            </Input>
            <Input
                id="address"
                element='input'
                label="Address"
                validators={[VALIDATOR_REQUIRE(),]}
                errorText="Please enter a valid address"
                onInput={InputHandler}
            >
            </Input>
            <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
        </form>
    )
}

export default NewPlace