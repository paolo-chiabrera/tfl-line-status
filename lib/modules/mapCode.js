import _ from 'lodash';

const idToCode = {
  '1': 'B',
  '2': 'C',
  '3': 'V',
  '4': 'J',
  '5': 'N',
  '6': 'P',
  '7': 'CI',
  '8': 'H',
  '9': 'D',
  '11': 'M',
  '12': 'W',
  '81': 'DLR',
  '82': 'OVG',
  '83': 'RAIL',
  '90': 'TRAMS'
};

const codeToId = _.invert(idToCode);

export default {
  idToCode,
  codeToId
};
