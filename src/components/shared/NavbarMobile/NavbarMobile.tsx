import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Menu } from 'lucide-react';
export default function NavbarMobile() {
  return (
    <Popover>
      <PopoverTrigger>
        <Menu />
      </PopoverTrigger>
      <PopoverContent>
        <p>Menu</p>
        <p>Menu</p>
        <p>Menu</p>
        <p>Menu</p>
      </PopoverContent>
    </Popover>
  );
}
