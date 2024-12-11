import { Button } from './uix/button';


const ControlButton = ({ children, onMouseDown, onMouseUp }: { children: JSX.Element, onMouseDown: () => void, onMouseUp: () => void }) => (
  <Button
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseUp}
    className='bg-gray-200 rounded-full p-2 text-gray-600 hover:bg-gray-300'
  >
    {children}
  </Button>
);

export default ControlButton;