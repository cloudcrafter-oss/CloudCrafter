import NxWelcome from './nx-welcome';
import { pluginsCodegen } from '@cloudcrafter-frontend/plugins/codegen';

export function App() {
  const value = pluginsCodegen()
  return (
    <div>
      <pre>{JSON.stringify({value}, null, 2)}</pre>
      <NxWelcome title="cloudcrafter-frontend" />
    </div>
  );
}

export default App;
