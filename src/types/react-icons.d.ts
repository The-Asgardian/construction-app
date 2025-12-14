// Type declaration to fix Icon component type compatibility with react-icons
import { IconType } from 'react-icons';

declare module '@chakra-ui/react' {
  export interface IconProps {
    as?: IconType | React.ComponentType<any> | string | any;
  }
}

