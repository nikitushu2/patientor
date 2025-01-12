import axios from "axios";
import { apiBaseUrl } from "../constants";
import { EntryWithoutId } from "../types";

const create = async (id: string, object: EntryWithoutId) => {
    const { data } = await axios.post(
      `${apiBaseUrl}/patients/${id}/entries`,
      object
    );
  
    return data;
  };

export default {create};