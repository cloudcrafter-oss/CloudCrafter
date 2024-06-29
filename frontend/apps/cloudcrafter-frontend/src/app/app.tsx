import NxWelcome from './nx-welcome';
import { pluginsCodegen } from '@cloudcrafter-frontend/plugins/codegen';
import { UiShared } from '@cloudcrafter-frontend/ui/shared';

export function App() {
  const value = pluginsCodegen()
  return (
    <div>
      <pre>{JSON.stringify({value}, null, 2)}</pre>
      <UiShared />
      <NxWelcome title="cloudcrafter-frontend" />
    </div>
  );
}

export default App;
