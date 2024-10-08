// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and

import {TAPIServerFile} from '../../../Models/utilityType';
export type TFileBgUploadStatus =
  | 'success'
  | 'pending'
  | 'processing'
  | 'error';
export type TFileBgUploadVariants = 'Project' | 'Docket' | 'Folder';
// limitations under the License.
export type TFileBgUploadData = {
  file: TAPIServerFile;
  thumbnailPath?: string;
  hostId: string; //! could be any id to extract a list of video belong to a certain hostID
  status: TFileBgUploadStatus;
  expired: number;

  errorMessage?: string;
  uploadVariant: TFileBgUploadVariants;
};
