import * as React from 'react';

import { useAsBind } from 'use-as-bind';

// const useMyWasm = createAsBindHook('library.wasm', {
//   imports: {
//     consoleLog: (message) => {
//       console.log(message);
//     },
//   },
// });

const Board = () => {
  const { loaded, instance, error } = useAsBind('library.wasm');
  return (
    <div>
      {loaded && instance.exports.exampleFunction("hello", "world")}
      {error && error.message}
    </div>
  );
};

export default Board;