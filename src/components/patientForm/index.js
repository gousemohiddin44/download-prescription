import {Button, InputLabel, TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
import { useFormik,Field,Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import jsPDF from 'jspdf';

import logo from '../../assests/logo.jpg';
import dot from '../../assests/dot.png';

const useStyles = makeStyles({
    form:{
        margin:'5% 20%',
    },
    label:{
        color:'black',
        fontSize:'1.2rem',
        fontWeight:'400',
        margin:'30px 0 10px 5px'
    },
    medicineInput:{
        margin:'2% 0',
    },
    btn:{
        fontWeight:'bold',
        padding:'10px',
        marginRight:'20px',
        marginTop:'20px'
    },
})

function PatientForm(){

    const classes = useStyles();

    const date = new Date();

    let numOfMeds = 0;

    const [medicineFields,setMedicineFields] = useState([{medicine:'',dose:'',duration:''}]);

    const handleMultipleInputs = ()=>{
        setMedicineFields([...medicineFields,{medicine:'',dose:'',duration:''}]);
    }

    const handleChangeInput = (index , event) => {
        const medValues = [...medicineFields];
        medValues[index][event.target.name] = event.target.value;
        setMedicineFields(medValues);
    };

    const patientSchema = Yup.object().shape({
        patientName:Yup.string().required("Required"),
        followupDate:Yup.date().required("Required")
    })


    const formik = useFormik({
        initialValues:{
            patientName:'',
            followupDate:''
        },
        validationSchema:patientSchema,
        onSubmit:(value)=>{
            console.log("formValues",value);
            console.log("values",medicineFields);

            const doc = new jsPDF('p','px');
            
            doc.text("Dr. John Doe", 30, 30);
            doc.text("John's clinical Services",30,50);
            value.printSettings.includes('includeLogo') && doc.addImage(logo,360,30,30,30);
            doc.text(date.toDateString(),30,80);
            doc.text(date.getHours()+"hr : "+date.getMinutes()+"min",340,80);
            doc.line(30,100,400,100);
            doc.text(value.patientName,30,125);
            medicineFields.map((medicineField,index)=>{

                numOfMeds=numOfMeds+1;
                return(
                        <div>
                            {doc.addImage(dot,40,(132+(index)*50),20,20)}
                            {doc.text(medicineField.medicine,60,(145+(index)*50))}
                            {doc.text(medicineField.dose,60,(160+(index)*50))}
                            {doc.text(medicineField.duration,80,(160+(index)*50))} 
                        </div>
                )
    
            });
            doc.text("Follow Up On",30,140+(numOfMeds*50));
            doc.text(value.followupDate,30,160+(numOfMeds*50));
            value.printSettings.includes('includeFooter') && <div>{doc.line(30,600,400,600)}{doc.text("Pune, Maharastra",30,620)}</div>
            doc.save(`${value.patientName}.pdf`);
        }
    })

    const { getFieldProps,handleSubmit,touched,errors} = formik;
 
    return(
        <FormikProvider value={formik}>
        <Form className={classes.form} autoComplete='off' onSubmit={handleSubmit}>
            <InputLabel className={classes.label} htmlFor='patientName' required>Patient Name</InputLabel>
            <TextField fullWidth name='patientName' label='patient name' variant='outlined' {...getFieldProps('patientName')}
            helperText={touched.patientName && errors.patientName}
            error={Boolean(touched.patientName && errors.patientName)}  />

            {medicineFields.map((medicineField,index)=>{ 
                return ( 
                    <div key={index}>
                    <InputLabel className={classes.label} required>Medicine</InputLabel>
                    
                    <div className={classes.medicineInput}>

                        <TextField style={{width:'48%'}}
                            required
                            name='medicine'
                            label='Medicine'
                            variant='outlined'
                            value={medicineField.medicine}
                            onChange={(event)=>{handleChangeInput(index,event)}}
                        />
                    
                        <TextField style={{marginLeft:'12px'}}
                            required
                            type='number'
                            name='dose'
                            label='Dose'
                            variant='outlined'
                            value={medicineField.dose}
                            onChange={(event)=>{handleChangeInput(index,event)}}
                        />
                    
                        <TextField style={{marginLeft:'12px'}}
                            required
                            type='number'
                            name='duration' 
                            label='Duration' 
                            variant='outlined'
                            value={medicineField.duration}
                            onChange={(event)=>{handleChangeInput(index,event)}}
                        />
                    </div>
            </div>)})}

            <Button variant='outlined' color='primary' className={classes.btn} onClick={handleMultipleInputs} >+ Add More</Button>

            <InputLabel className={classes.label} htmlFor='followupDate' required>Followup Date</InputLabel>
            <TextField type='date' name='followupDate' variant='outlined' {...getFieldProps('followupDate')}
            helperText={touched.followupDate && errors.followupDate}
            error={Boolean(touched.followupDate && errors.followupDate)} />


            <InputLabel id="checkbox-group" className={classes.label} >Print Settings</InputLabel>
                <div role="group" aria-labelledby="checkbox-group">
                    <label style={{fontSize:'1.1rem',fontWeight:'400',margin:'5px 0'}}>
                    <Field type="checkbox" name="printSettings" value="includeFooter" />
                    Include Footer
                    </label>
                    <br />
                    <label style={{fontSize:'1.1rem',fontWeight:'400',margin:'5px 0'}} >
                    <Field type="checkbox" name="printSettings" value="includeLogo" />
                    Include Clinic Logo
                    </label>
                </div>

            <Button type='submit' variant='contained' className={classes.btn} style={{backgroundColor:'lightgreen'}}>Print Prescription</Button>
            <Button type='reset' variant='contained' className={classes.btn} onClick={()=>{setMedicineFields([{medicine:'',dose:'',duration:''}])}}> Reset</Button>
        </Form>
        </FormikProvider>
    )

};

export default PatientForm;