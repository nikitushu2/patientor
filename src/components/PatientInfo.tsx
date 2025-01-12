import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Entry, Diagnosis, Code} from "../types";
import diagnosisService from "../services/diagnoses";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";
import patientService from "../services/patients";

const getCurrentDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

export default function PatientInfo() {
    const location = useLocation();
    const {patient} = location.state || {};
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [entry, setEntry] = useState({
        description: '',
        date: getCurrentDate(),
        specialist: '',
        diagnosisCodes: [] as Code[],
        type: 'OccupationalHealthcare',
        healthCheckRating: 0,
        employerName: '',
        sickLeave: {startDate: '', endDate: ''},
        discharge: {date: '', criteria: ''}
});
    const [currentPatient, setCurrentPatient] = useState(patient);

    useEffect(() => {
        diagnosisService.getDiagnoses()
            .then(data => {
                setDiagnoses(data);
            });
    }, []);

    /*useEffect(() => {
        setCurrentPatient({...patient, entries: [...patient.entries, entry]});
        console.log('patient: ', patient);
    }, [entry]);*/

    useEffect(() => {
            patientService.getPatient(patient.id).then((patientData) => {
              setCurrentPatient(patientData);
            });
          
      }, [entry]);

    return (
        <>
        <h1>{patient.name}</h1>
        <p>gender: {patient.gender}</p>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        <AddEntryForm patient={patient} entry={entry} setEntry={setEntry}/>
        <h2>Entries</h2>
        {currentPatient.entries.map((entry: Entry) => (
            <div key={entry.id}>
            <p><EntryDetails entry={entry}/> {entry.date} {entry.description}</p>
            <ul>
            {entry.diagnosisCodes?.map(code => (
                <li key={code}>{code} {diagnoses.find(diagnosis => diagnosis.code === code)?.name}</li>
            ))}
            </ul>
            <p>diagnose by {entry.specialist}</p>
            </div>
        ))}
        </>
    );
}