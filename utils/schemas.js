import * as yup from "yup";
import { isValidRegex } from "./helpers";

const validationNamesCompairedBackend = {
    required: true,
    string: true,
    number: true,
    email: true,
};

const name = yup.string().required("Name is required").trim()
const email = yup.string().required("Please enter email address").matches(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "Invalid Email Address"
);

const ssn = yup.string().required("SSN is required")
    .matches(/^[0-8]\d{2}-(?!0{2})\d{2}-(?!0{4})\d{4}$/, "Invalid SSN format!")
    .trim();

const irp = yup.string().required("IRP is required")
    .matches(/^[A-Z]{2}\d{7}$/, "Invalid ssn format!")
    .trim();
const ifta = yup.string().required("IRP is required")
    .matches(/^[A-Z]{2}\d{7}$/, "Invalid ssn format!")
    .trim();

const phone = yup.string().required("Please enter phone number").min(13, "Invalid phone number");

const zip_code = yup.string()
    .required("Required")
const initial1 = yup.string()
    .required("Required")
    .matches(/^[a-zA-Z]+$/, "Must be only letters")
    .min(2, 'too short');

const initialConfirm = yup.string().required("Required").oneOf([yup.ref('initial1'), null], 'Initials must be the same');
const vin = yup.string()
    .required("Required")
    .matches(/^[0-9A-Z]+$/, "Must be only numbers and letters")
    .min(17, 'Must be exactly 17 characters')
    .max(17, 'Must be exactly 17 characters')
const cardNumber = yup.string()
    .required("Required")
    .min(15, 'Must be at least 15 digits')
    .max(16, 'Must be no more than 16 digits')
const select = yup.object().required("Please select option");
const text = yup.string().required("Required field").trim();
const password = yup
    .string()
    .required("Password is required")
    .min(8, "Too short!")
    .matches(/[a-zA-Z]/, 'Must include at least one letter')
    .matches(/[0-9]/, 'Must include at least one number')
    .matches(/[^a-zA-Z0-9\s]/, 'Must include any symbol');
    
const passwordConfirm = yup.string().required("Please, confirm password").oneOf([yup.ref('password'), null], 'Passwords must match');
const nrValid = yup
    .string()
    .nullable()
    .notRequired()
    .when('nrValid', {
        is: (value) => value?.length,
        then: (rule) => rule.min(3),
    });
const number = yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits");

const number_max_32 = yup.string()
    .required("Required")
    .max(32, 'Must be no more least 32 digits')
    .matches(/^[0-9]+$/, "Must be only digits");

const object = yup.object().required("Please select option");
const required = yup.string().required("Required!").trim()
const year = yup.string().required("Required!").test('valid-year', 'Invalid year', (value) => {
    const regex = /^[0-9]+$/;
  
    if (!regex.test(value)) {
        return new yup.ValidationError("Must contain only digits", null, 'year');
    };

    if (+value > new Date().getUTCFullYear() + 1) {
        return new yup.ValidationError(`Year must be ${new Date().getUTCFullYear() + 1} or earlier`, null, 'year');
    };
    return true;
}).trim();

const ein = yup.string().required("Required!").min(9);
const string = yup.string().required().matches(/^[a-zA-Z]+$/, 'Must be only letters');

const cvv = yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(3, 'Must be exactly 3 digits')
    .max(3, 'Must be exactly 3 digits');
    
const cvvAmex = yup.string()
.required("Required")
.matches(/^[0-9]+$/, "Must be only digits")
.min(4, 'Must be exactly 4 digits')
.max(4, 'Must be exactly 4 digits');

const amount = yup.string()
    .required("Required")
    .matches(/^\$?(\d+(\.\d{1,2})?)$/, "Must be only digits")
    .max(9, 'Must be exactly 8 digits')

const iftaAccountNumber = yup.string()
    .required('Required')
    .test('not-zero', 'Invalid Ifta Account Number', (value) => value !== '0')

const irpAccountNumber = yup.string()
    .required('Required')
    .test('not-zero', 'Invalid Irp Account Number', (value) => value !== '0')

const arrayOrString = yup.mixed().test('arrayOrString', 'Must be a string or an array', value => {
    return typeof value === 'string' || (Array.isArray(value) && value.length);
});

const cardHolder = yup.string().required('Required').matches(/^[a-zA-Z]+(?:[\'\.\-\s][a-zA-Z]+)+$/, 'Invalid Hoder Name');

const vehicleMake = yup.string()
    .required('Required')
    .matches(/^(?!.*([a-zA-Z])\1{4,}).*$/, 'Invalid Make')

const vehicleModel = yup.string()
    .required('Required')
    .matches(/^(?!.*([a-zA-Z])\1{4,}).*$/, 'Invalid Model')

const schemas = {
    year,
    name,
    email,
    object,
    initial1,
    zip_code,
    initialConfirm,
    cardNumber,
    number,
    ssn,
    vin,
    required,
    phone,
    select,
    text,
    password,
    passwordConfirm,
    nrValid,
    irp,
    ifta,
    ein,
    string,
    cvv,
    cvvAmex,
    amount,
    iftaAccountNumber,
    irpAccountNumber,
    arrayOrString,
    number_max_32,
    cardHolder,
    vehicleMake,
    vehicleModel
};

export function getExtraFieldValidation(conditions) {
    let validation = yup.string();

    conditions.forEach(el => {
        const validationName = el.conditions;

        if(validationName?.includes('max_') || validationName?.includes('min_') || validationName?.includes('max:') || validationName?.includes('min:')) {
            const splitedName = validationName.includes(':') ? validationName?.split(':') : validationName?.split('_');
            const validateNumber = Number(splitedName?.[splitedName?.length - 1]);

            let name = 'min';
            if(validationName?.includes('max_') || validationName?.includes('max:')) {
                name = 'max';
            };

            if(validateNumber || validateNumber === 0) {
                if(typeof validation?.[name] === 'function') {
                    validation = validation?.[name]?.(validateNumber, `Must be exactly ${validateNumber} digits`);
                };
            };
        } else if(validationNamesCompairedBackend?.[validationName]) {
            if(validationName === 'required') {
                if(typeof validation.required === 'function') {
                    validation = validation.required('Required');
                };
            } else {
                if(typeof validation?.[validationName] === 'function') {
                    validation = validation?.[validationName]?.();
                };
            };
        } else if(validationName?.includes('regex:')) {
            const regexRule = validationName.split('regex:')?.[1];
            if(isValidRegex(regexRule)) {
                validation = validation.matches(new RegExp(regexRule), 'Invalid Value');
            };
        };
    });

    return validation;
};

export const registerSchema = yup.object({
    email,
    phone,
    application_type: object,
    state: object,
});

export const commentSchema = yup.object({
    name,
    email,
    phone,
    comments: text,
});

export const contactSchema = yup.object({
    name,
    email,
    phone,
    subject: text,
    message: text,
});

export const loginSchema = yup.object({
    email,
    password
});

export const signupSchema = yup.object({
    name: name,
    last_name: yup.string().required("Business Name is required").trim(),
    email,
    phone,
    password,
    passwordConfirm
});

export const resetPasswordSchema = yup.object({
    password,
    passwordConfirm
});

export const paymentSchema = {
    address: schemas.text,
    city: schemas.text,
    state: schemas.select,
    zip_code: schemas.zip_code,
    initial1: schemas.initial1,
    initial2: schemas.initialConfirm,
    initial3: schemas.initialConfirm,
    initial4: schemas.initialConfirm,
    signature: schemas.required,
    cardNumber: schemas.cardNumber,
    cardHolder: schemas.cardHolder,
    cardDate: schemas.required
};

export default schemas;