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
// limitations under the License.

import {DocumentDirectoryPath} from 'react-native-fs';
export const ROOT_LOCAL_QA_FOLDER_PATH = DocumentDirectoryPath + '/QA';

//!---> IMAGE PATH <---!//
export const ROOT_LOCAL_QA_IMAGE_FOLDER_PATH =
  ROOT_LOCAL_QA_FOLDER_PATH + '/Images';
export const EXPIRED_PROJECT_FILE_PATH =
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + '/expiredProject';

export const EXPIRED_QA_LIST_FILE_PATH =
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + '/expiredQAList';

export const EXPIRED_QA_FILE_PATH =
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + '/expiredQA';

export const DELETED_QA_IMAGE_FILE_PATH =
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + '/deletedQaImage';

export const PATH_TO_TEMP_PDF_FOLDER = DocumentDirectoryPath + '/TempQA';

export const PATH_TO_PENDING_UPLOAD_QA =
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + '/pendingUploadFile';

export const PATH_TO_ERROR_UPLOAD_QA =
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + '/pendingErrorFile';

export const PATH_TO_PENDING_DELETE_QA =
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + '/pendingDeleteFile';

//! <-----------> !//

//!---> VIDEO PATH <---!//
export const ROOT_QA_CACHE_VIDEO_FOLDER_PATH =
  ROOT_LOCAL_QA_FOLDER_PATH + '/Video';
export const ROOT_QA_ALL_VIDEO_INFO_FILES =
  ROOT_QA_CACHE_VIDEO_FOLDER_PATH + '/qaVideosInfo';
export const ROOT_QA_PENDING_VIDEO_THUMBNAILS_FOLDER =
  ROOT_QA_CACHE_VIDEO_FOLDER_PATH + '/qaVideoThumbnails';

//! <-----------> !//
