// 'use client';

// import { forwardRef, useMemo, useState } from 'react';
// import { HexColorPicker } from 'react-colorful';
// import { cn } from '@/lib/utils';
// import { useForwardedRef } from '@/lib/use-forwarded-refs'; 
// import type { ButtonProps } from '@/components/ui/button';
// import { Button } from '@/components/ui/button';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Input } from '@/components/ui/input';

// interface ColorPickerProps {
//   value: string;
//   onChange: (value: string) => void;
//   onBlur?: () => void;
// }

// const ColorPicker = forwardRef<
//   HTMLInputElement,
//   Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps & ButtonProps
// >(
//   (
//     { disabled, value, onChange, onBlur, name, className, size, ...props },
//     forwardedRef
//   ) => {
//     const ref = useForwardedRef(forwardedRef);
//     const [open, setOpen] = useState(false);

//     const parsedValue = useMemo(() => {
//       return value || '#FFFFFF';
//     }, [value]);

//     return (
//       <Popover onOpenChange={setOpen} open={open}>
//         <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
//           <Button
//             {...props}
//             className={cn('block', className)}
//             name={name}
//             onClick={() => {
//               setOpen(true);
//             }}
//             size={size}
//             style={{
//               backgroundColor: parsedValue,
//             }}
//             variant='outline'
//           >
//             <div />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className='w-full'>
//           <HexColorPicker color={parsedValue} onChange={onChange} />
//           <Input
//             maxLength={7}
//             onChange={(e) => {
//               onChange(e?.currentTarget?.value);
//             }}
//             ref={ref}
//             value={parsedValue}
//           />
//         </PopoverContent>
//       </Popover>
//     );
//   }
// );
// ColorPicker.displayName = 'ColorPicker';

// export { ColorPicker };


// components/ui/color-picker.tsx
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[100px] justify-start">
          <div 
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: value }}
          />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <HexColorPicker color={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};