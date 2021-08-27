import { isString } from '@sajari/react-sdk-utils';

import { PipelineOption } from '../types';

export function getPipelineInfo(pipeline: PipelineOption) {
  return isString(pipeline) ? { name: pipeline } : pipeline;
}
