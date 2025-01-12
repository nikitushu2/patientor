/* eslint-disable @typescript-eslint/no-explicit-any */
import {  TextField, InputLabel, MenuItem, Select, Button, SelectChangeEvent } from '@mui/material';
import { Entry, Code, Patient} from "../types";
import { SyntheticEvent } from 'react';
import entriesService from "../services/entries";

const codes = ["M24.2", "M51.2", "S03.5", "J10.1", "J06.9", "Z57.1", "N30.0", "H54.7", "J03.0", "L60.1", "Z74.3", "L20", "F43.2", "S62.5", "H35.29"];
const types = ["HealthCheck", "OccupationalHealthcare", "Hospital"];
const healthCheckRating = {"Healthy": 0, "LowRisk": 1, "HighRisk": 2, "CriticalRisk": 3};

type RandomObject = {
    id?: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes: Code[];
    type: string;
    healthCheckRating: number; // Optional for non-HealthCheck types
    employerName: string; // Optional for non-OccupationalHealthcare types
    sickLeave: { startDate: string; endDate: string }; // Optional for non-OccupationalHealthcare types
    discharge: { date: string; criteria: string }; // Optional for non-Hospital types
  };

interface Props {
    entry: RandomObject,
    setEntry: React.Dispatch<React.SetStateAction<RandomObject>>,
    patient: Patient
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AddEntryForm = ({entry, setEntry, patient}: Props) => {

    const handleDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
        const {target: { value }} = event;
        const validCodes = (typeof value === 'string' ? value.split(',') : value).filter((code): code is Code => codes.includes(code as Code));
        setEntry({
            ...entry,
            diagnosisCodes: validCodes,
        });
    };

    function addEntry(event: SyntheticEvent) {
        event.preventDefault();
        const {
            description,
            date,
            specialist,
            diagnosisCodes,
            healthCheckRating,
            employerName,
            sickLeave,
            discharge
        } = entry;
        switch (entry.type) {
            case 'HealthCheck': entriesService.create(patient.id, {description, date, specialist, type: 'HealthCheck', diagnosisCodes, healthCheckRating}).then(data => setEntry(data));
            break;
            case "OccupationalHealthcare": entriesService.create(patient.id, {description, date, specialist, type: "OccupationalHealthcare", diagnosisCodes, employerName, sickLeave}).then(data => setEntry(data));
            break;
            case "Hospital": entriesService.create(patient.id, {description, date, specialist, type: "Hospital", diagnosisCodes, discharge}).then(data => setEntry(data));
            break;
        }

    }

    return (
        <>
        <h2>Add entry</h2>
        <form onSubmit={addEntry}>
        <InputLabel>description</InputLabel>
        <TextField
          fullWidth 
          value={entry.description}
          onChange={({ target }) => setEntry({...entry, description: target.value})}
        />
        <InputLabel>date</InputLabel>
        <TextField
          type="date"
          fullWidth 
          value={entry.date}
          onChange={({ target }) => {
            setEntry({...entry, date: target.value});
        }}
        />
        <InputLabel>specialist</InputLabel>
        <TextField
          fullWidth 
          value={entry.specialist}
          onChange={({ target }) => setEntry({...entry, specialist: target.value})}
        />
        <InputLabel>diagnosis codes</InputLabel>
        <Select
          label="diagnosis codes"
          fullWidth
          multiple
          value={entry.diagnosisCodes}
          onChange={handleDiagnosisCodesChange}
          renderValue={(selected) => selected.join(', ')}
        >
        {codes.map(option =>
          <MenuItem
            key={option}
            value={option}
          >
            {option}</MenuItem>
        )}
        </Select>
        <InputLabel>type</InputLabel>
        <Select
          label="type"
          fullWidth
          value={entry.type}
          onChange={({ target }) => setEntry({...entry, type: target.value as Entry['type']})}
        >
        {types.map(option =>
          <MenuItem
            key={option}
            value={option}
          >
            {option}</MenuItem>
        )}
        </Select>
        {entry.type === "HealthCheck" && (
            <>
            <InputLabel>health check rating</InputLabel>
            <Select
            label="health check rating"
            fullWidth
            value={entry.healthCheckRating}
            onChange={({ target }) => setEntry({...entry, healthCheckRating: Number(target.value)})}
            >

            {Object.entries(healthCheckRating).map(([key, value]) => (
                <MenuItem
                    key={key}
                    value={value}
                >
                    {key}{' '}{value}
                </MenuItem>
            ))}

            </Select>
            </>
        )}
        {entry.type === "OccupationalHealthcare" && (
            <>
            <InputLabel>employer name</InputLabel>
            <TextField
            fullWidth 
            value={entry.employerName}
            onChange={({ target }) => setEntry({...entry, employerName: target.value})}
            />
            <InputLabel>sick leave start date</InputLabel>
            <TextField
            type="date"
            fullWidth 
            value={entry.sickLeave?.startDate}
            onChange={({ target }) => setEntry({...entry, sickLeave: {...entry.sickLeave, startDate: target.value}})}
            />
            <InputLabel>sick leave end date</InputLabel>
            <TextField
            type="date"
            fullWidth 
            value={entry.sickLeave?.endDate}
            onChange={({ target }) => setEntry({...entry, sickLeave: {...entry.sickLeave, endDate: target.value}})}
            />
            </>
        )}
        {entry.type === "Hospital" && (
            <>
            <InputLabel>discharge date</InputLabel>
            <TextField
            type="date"
            fullWidth 
            value={entry.discharge?.date}
            onChange={({ target }) => setEntry({...entry, discharge: {...entry.discharge, date: target.value}})}
            />
            <InputLabel>discharge criteria</InputLabel>
            <TextField
            fullWidth 
            value={entry.discharge?.criteria}
            onChange={({ target }) => setEntry({...entry, discharge: {...entry.discharge, criteria: target.value}})}
            />
            </>
        )}
        <Button
            style={{
            float: "right",
            marginTop: '5px'
            }}
            type="submit"
            variant="contained"
        >
            Add
        </Button>
        </form>
        </>
    );
};

export default AddEntryForm;