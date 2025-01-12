import { Entry } from "../types";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';

function assertNever(value: never): never {
    throw new Error(`Unhandled type: ${JSON.stringify(value)}`);
}

const EntryDetails: React.FC<{entry: Entry}> = ({entry}) => {
    switch(entry.type) {
        case "Hospital":
            return <LocalHospitalIcon />;
        case "OccupationalHealthcare":
            return <WorkIcon />;
        case "HealthCheck":
            return null;
        default:
            return assertNever(entry);
    }
};

export default EntryDetails;