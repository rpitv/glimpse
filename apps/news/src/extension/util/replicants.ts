/* eslint-disable max-len */

import { get as nodecg } from './nodecg';
import { NewsImage } from "@news/types/schemas/image";

nodecg().Replicant<NewsImage[]>("newsImages", "news", {defaultValue: []});
