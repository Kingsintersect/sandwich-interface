"use client";

import React from 'react';
import { X } from 'lucide-react';

// Enhanced FourWayDrawer Context
const FourWayDrawerContext = React.createContext<{
    isFullPage?: boolean;
    direction?: 'bottom' | 'top' | 'left' | 'right';
}>({});

// Utility function for class names
const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

interface FourWayDrawerRootProps {
    children: React.ReactNode;
    isFullPage?: boolean;
    direction?: 'bottom' | 'top' | 'left' | 'right';
}

function FourWayDrawer({ children, isFullPage = false, direction = 'bottom', ...props }: FourWayDrawerRootProps) {
    return (
        <FourWayDrawerContext.Provider value={{ isFullPage, direction }}>
            <div data-slot="drawer" {...props}>
                {children}
            </div>
        </FourWayDrawerContext.Provider>
    );
}

interface FourWayDrawerTriggerProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

function FourWayDrawerTrigger({ children, onClick, className, ...props }: FourWayDrawerTriggerProps) {
    return (
        <button
            data-slot="drawer-trigger"
            onClick={onClick}
            className={cn("outline-none", className)}
            {...props}
        >
            {children}
        </button>
    );
}

interface FourWayDrawerOverlayProps {
    className?: string;
    onClick?: () => void;
}

function FourWayDrawerOverlay({ className, onClick, ...props }: FourWayDrawerOverlayProps) {
    return (
        <div
            data-slot="drawer-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                className
            )}
            onClick={onClick}
            {...props}
        />
    );
}

interface FourWayDrawerContentProps {
    className?: string;
    children: React.ReactNode;
    isOpen?: boolean;
}

function FourWayDrawerContent({ className, children, isOpen = false, ...props }: FourWayDrawerContentProps) {
    const { isFullPage, direction } = React.useContext(FourWayDrawerContext);

    const getContentClasses = () => {
        const baseClasses = "group/drawer-content bg-white fixed z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out";

        if (isFullPage) {
            return cn(
                baseClasses,
                "inset-0 w-full h-full max-w-none max-h-none rounded-none border-none",
                isOpen ? "translate-x-0 translate-y-0" : "translate-y-full"
            );
        }

        switch (direction) {
            case 'bottom':
                return cn(
                    baseClasses,
                    "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t",
                    isOpen ? "translate-y-0" : "translate-y-full"
                );
            case 'top':
                return cn(
                    baseClasses,
                    "inset-x-0 top-0 mb-24 max-h-[80vh] rounded-b-lg border-b",
                    isOpen ? "translate-y-0" : "-translate-y-full"
                );
            case 'right':
                return cn(
                    baseClasses,
                    "inset-y-0 right-0 w-3/4 max-w-sm border-l",
                    isOpen ? "translate-x-0" : "translate-x-full"
                );
            case 'left':
                return cn(
                    baseClasses,
                    "inset-y-0 left-0 w-3/4 max-w-sm border-r",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                );
            default:
                return cn(
                    baseClasses,
                    "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t",
                    isOpen ? "translate-y-0" : "translate-y-full"
                );
        }
    };

    return (
        <div
            data-slot="drawer-content"
            className={cn(getContentClasses(), className)}
            {...props}
        >
            {!isFullPage && direction === 'bottom' && (
                <div className="mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-gray-300" />
            )}
            {children}
        </div>
    );
}

interface FourWayDrawerHeaderProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerHeader({ className, ...props }: FourWayDrawerHeaderProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <div
            data-slot="drawer-header"
            className={cn(
                "flex flex-col gap-2 p-6",
                isFullPage ? "bg-gradient-to-r from-blue-900 to-indigo-900 text-white" : "border-b",
                className
            )}
            {...props}
        />
    );
}

interface FourWayDrawerFooterProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerFooter({ className, ...props }: FourWayDrawerFooterProps) {
    return (
        <div
            data-slot="drawer-footer"
            className={cn("mt-auto flex flex-col gap-2 p-6", className)}
            {...props}
        />
    );
}

interface FourWayDrawerTitleProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerTitle({ className, ...props }: FourWayDrawerTitleProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <h2
            data-slot="drawer-title"
            className={cn(
                "font-semibold text-lg",
                isFullPage ? "text-white" : "text-gray-900",
                className
            )}
            {...props}
        />
    );
}

interface FourWayDrawerDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerDescription({ className, ...props }: FourWayDrawerDescriptionProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <p
            data-slot="drawer-description"
            className={cn(
                "text-sm",
                isFullPage ? "text-blue-100" : "text-gray-600",
                className
            )}
            {...props}
        />
    );
}

interface FourWayDrawerCloseProps {
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

function FourWayDrawerClose({ className, onClick, children, ...props }: FourWayDrawerCloseProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <button
            data-slot="drawer-close"
            onClick={onClick}
            className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-colors duration-200",
                isFullPage
                    ? "text-white hover:bg-white/10"
                    : "text-gray-500 hover:bg-gray-100",
                className
            )}
            {...props}
        >
            {children || <X className="h-5 w-5" />}
        </button>
    );
}


export {
    FourWayDrawer,
    FourWayDrawerTrigger,
    FourWayDrawerOverlay,
    FourWayDrawerContent,
    FourWayDrawerHeader,
    FourWayDrawerFooter,
    FourWayDrawerTitle,
    FourWayDrawerDescription,
    FourWayDrawerClose,
};
    
/**
 * usage example:for half page drawer
 */
// {/* <FourWayDrawer direction="bottom">
//     <FourWayDrawerTrigger onClick={() => setIsOpen(true)}>
//         Open FourWayDrawer
//     </FourWayDrawerTrigger>
//     {isOpen && (
//         <>
//             <FourWayDrawerOverlay onClick={() => setIsOpen(false)} />
//             <FourWayDrawerContent isOpen={isOpen}>
//                 <FourWayDrawerHeader>
//                     <FourWayDrawerTitle>Move Goal</FourWayDrawerTitle>
//                     <FourWayDrawerDescription>Set your daily activity goal.</FourWayDrawerDescription>
//                 </FourWayDrawerHeader>
//                 <div className="p-6">
//                     {/* Your content like the calorie counter */}
//                 </div>
//                 <FourWayDrawerClose onClick={() => setIsOpen(false)} />
//             </FourWayDrawerContent>
//         </>
//     )}
// </FourWayDrawer> */}
    

/**
 * usage example:for full page drawer
 */
// {/* <FourWayDrawer isFullPage={true}>
//     <FourWayDrawerContent isOpen={isOpen}>
//         <FourWayDrawerHeader>
//             <FourWayDrawerTitle>Terms & Conditions</FourWayDrawerTitle>
//             <FourWayDrawerDescription>Complete documentation</FourWayDrawerDescription>
//         </FourWayDrawerHeader>
//         <div className="flex-1 overflow-y-auto p-6">
//             {/* Complex content with scrolling */}
//         </div>
//         <FourWayDrawerClose onClick={() => setIsOpen(false)} />
//     </FourWayDrawerContent>
// </FourWayDrawer> */}









    

// // Demo component showcasing both versions
// const FourWayDrawerDemo: React.FC = () => {
//     const [isDefaultOpen, setIsDefaultOpen] = useState(false);
//     const [isFullPageOpen, setIsFullPageOpen] = useState(false);
//     const [direction, setDirection] = useState<'bottom' | 'top' | 'left' | 'right'>('bottom');

//     const directions = [
//         { value: 'bottom', label: 'Bottom' },
//         { value: 'top', label: 'Top' },
//         { value: 'left', label: 'Left' },
//         { value: 'right', label: 'Right' }
//     ] as const;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
//             <div className="max-w-4xl mx-auto space-y-8">
//                 {/* Header */}
//                 <div className="text-center space-y-4">
//                     <h1 className="text-4xl font-bold text-gray-800">Enhanced FourWayDrawer Component</h1>
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         A flexible drawer component that supports both default modal behavior and full-page display,
//                         with customizable directions and smooth animations.
//                     </p>
//                 </div>

//                 {/* Controls */}
//                 <div className="bg-white rounded-xl p-6 shadow-lg">
//                     <h2 className="text-xl font-semibold mb-4">Try Different Configurations</h2>

//                     <div className="grid md:grid-cols-2 gap-6">
//                         <div className="space-y-4">
//                             <h3 className="font-medium text-gray-800">Direction for Default FourWayDrawer</h3>
//                             <div className="grid grid-cols-2 gap-2">
//                                 {directions.map(({ value, label }) => (
//                                     <button
//                                         key={value}
//                                         onClick={() => setDirection(value)}
//                                         className={cn(
//                                             "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
//                                             direction === value
//                                                 ? "bg-blue-600 text-white"
//                                                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                         )}
//                                     >
//                                         {label}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <h3 className="font-medium text-gray-800">FourWayDrawer Actions</h3>
//                             <div className="space-y-2">
//                                 <FourWayDrawerTrigger
//                                     onClick={() => setIsDefaultOpen(true)}
//                                     className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
//                                 >
//                                     Open Default FourWayDrawer ({direction})
//                                 </FourWayDrawerTrigger>
//                                 <FourWayDrawerTrigger
//                                     onClick={() => setIsFullPageOpen(true)}
//                                     className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
//                                 >
//                                     Open Full Page FourWayDrawer
//                                 </FourWayDrawerTrigger>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Feature Showcase */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                     <div className="bg-white rounded-xl p-6 shadow-lg">
//                         <h3 className="text-lg font-semibold mb-4 flex items-center">
//                             <Menu className="h-5 w-5 mr-2 text-blue-600" />
//                             Default FourWayDrawer Features
//                         </h3>
//                         <ul className="space-y-2 text-gray-600">
//                             <li>• Partial screen coverage (80vh max)</li>
//                             <li>• Backdrop blur overlay</li>
//                             <li>• Drag handle for bottom drawer</li>
//                             <li>• Multiple directions: bottom, top, left, right</li>
//                             <li>• Smooth slide animations</li>
//                             <li>• Click outside to close</li>
//                         </ul>
//                     </div>

//                     <div className="bg-white rounded-xl p-6 shadow-lg">
//                         <h3 className="text-lg font-semibold mb-4 flex items-center">
//                             <FileText className="h-5 w-5 mr-2 text-indigo-600" />
//                             Full Page Features
//                         </h3>
//                         <ul className="space-y-2 text-gray-600">
//                             <li>• Complete screen coverage</li>
//                             <li>• Styled header with gradients</li>
//                             <li>• Perfect for complex content</li>
//                             <li>• Scrollable content area</li>
//                             <li>• Professional appearance</li>
//                             <li>• Easy integration</li>
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Usage Example */}
//                 <div className="bg-gray-900 text-green-400 rounded-xl p-6 shadow-lg">
//                     <h3 className="text-lg font-semibold mb-4 text-white">Usage Example</h3>
//                     <pre className="text-sm overflow-x-auto">
//                         {`// Default FourWayDrawer
// <FourWayDrawer direction="${direction}">
//   <FourWayDrawerTrigger onClick={() => setOpen(true)}>
//     Open FourWayDrawer
//   </FourWayDrawerTrigger>
//   {isOpen && (
//     <>
//       <FourWayDrawerOverlay onClick={() => setOpen(false)} />
//       <FourWayDrawerContent isOpen={isOpen}>
//         <FourWayDrawerHeader>
//           <FourWayDrawerTitle>Default FourWayDrawer</FourWayDrawerTitle>
//           <FourWayDrawerDescription>Partial screen coverage</FourWayDrawerDescription>
//         </FourWayDrawerHeader>
//         <div className="flex-1 p-6">Content here</div>
//         <FourWayDrawerClose onClick={() => setOpen(false)} />
//       </FourWayDrawerContent>
//     </>
//   )}
// </FourWayDrawer>

// // Full Page FourWayDrawer
// <FourWayDrawer isFullPage={true}>
//   <FourWayDrawerContent isOpen={isOpen}>
//     <FourWayDrawerHeader>
//       <FourWayDrawerTitle>Full Page FourWayDrawer</FourWayDrawerTitle>
//       <FourWayDrawerDescription>Complete screen coverage</FourWayDrawerDescription>
//     </FourWayDrawerHeader>
//     <div className="flex-1 overflow-y-auto p-6">Content here</div>
//     <FourWayDrawerClose onClick={() => setOpen(false)} />
//   </FourWayDrawerContent>
// </FourWayDrawer>`}
//                     </pre>
//                 </div>
//             </div>

//             {/* Default FourWayDrawer */}
//             <FourWayDrawer direction={direction}>
//                 {isDefaultOpen && (
//                     <>
//                         <FourWayDrawerOverlay onClick={() => setIsDefaultOpen(false)} />
//                         <FourWayDrawerContent isOpen={isDefaultOpen}>
//                             <FourWayDrawerHeader>
//                                 <FourWayDrawerTitle>Default FourWayDrawer</FourWayDrawerTitle>
//                                 <FourWayDrawerDescription>
//                                     This is a {direction} drawer with default behavior. It covers part of the screen and includes a backdrop.
//                                 </FourWayDrawerDescription>
//                             </FourWayDrawerHeader>
//                             <div className="flex-1 p-6 space-y-4">
//                                 <div className="bg-gray-50 rounded-lg p-4">
//                                     <h4 className="font-medium text-gray-800 mb-2">Sample Content</h4>
//                                     <p className="text-gray-600 text-sm">
//                                         This drawer slides in from the {direction} and maintains the classic drawer UX with
//                                         partial screen coverage and backdrop interaction.
//                                     </p>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="bg-blue-50 p-4 rounded-lg text-center">
//                                         <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//                                         <p className="text-sm font-medium">Settings</p>
//                                     </div>
//                                     <div className="bg-green-50 p-4 rounded-lg text-center">
//                                         <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
//                                         <p className="text-sm font-medium">Profile</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <FourWayDrawerClose onClick={() => setIsDefaultOpen(false)} />
//                         </FourWayDrawerContent>
//                     </>
//                 )}
//             </FourWayDrawer>

//             {/* Full Page FourWayDrawer */}
//             <FourWayDrawer isFullPage={true}>
//                 {isFullPageOpen && (
//                     <>
//                         <FourWayDrawerOverlay onClick={() => setIsFullPageOpen(false)} />
//                         <FourWayDrawerContent isOpen={isFullPageOpen}>
//                             <FourWayDrawerHeader>
//                                 <FourWayDrawerTitle>Full Page FourWayDrawer</FourWayDrawerTitle>
//                                 <FourWayDrawerDescription>
//                                     Complete screen coverage perfect for complex interfaces and detailed content.
//                                 </FourWayDrawerDescription>
//                             </FourWayDrawerHeader>
//                             <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
//                                 <div className="bg-white rounded-xl p-6 shadow-sm">
//                                     <h4 className="font-semibold text-gray-800 mb-4">Full Page Benefits</h4>
//                                     <div className="grid md:grid-cols-2 gap-4">
//                                         <div className="space-y-3">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                                                 <span className="text-sm">Maximum content visibility</span>
//                                             </div>
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="w-2 h-2 bg-green-600 rounded-full"></div>
//                                                 <span className="text-sm">Professional appearance</span>
//                                             </div>
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
//                                                 <span className="text-sm">Scrollable content areas</span>
//                                             </div>
//                                         </div>
//                                         <div className="space-y-3">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
//                                                 <span className="text-sm">Perfect for forms</span>
//                                             </div>
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="w-2 h-2 bg-red-600 rounded-full"></div>
//                                                 <span className="text-sm">Terms & conditions</span>
//                                             </div>
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
//                                                 <span className="text-sm">Detailed documentation</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="bg-white rounded-xl p-6 shadow-sm">
//                                     <h4 className="font-semibold text-gray-800 mb-4">Sample Form</h4>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                                             <input className="w-full p-2 border rounded-lg" placeholder="Enter your name" />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                                             <input className="w-full p-2 border rounded-lg" placeholder="Enter your email" />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
//                                             <textarea className="w-full p-2 border rounded-lg h-24" placeholder="Your message"></textarea>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="bg-white rounded-xl p-6 shadow-sm">
//                                     <h4 className="font-semibold text-gray-800 mb-4">Additional Content</h4>
//                                     <p className="text-gray-600 mb-4">
//                                         This full page drawer can contain any amount of content with proper scrolling behavior.
//                                         It's perfect for complex interfaces that need the full screen real estate.
//                                     </p>
//                                     <div className="grid grid-cols-3 gap-4">
//                                         {[1, 2, 3, 4, 5, 6].map((item) => (
//                                             <div key={item} className="bg-gray-100 p-4 rounded-lg text-center">
//                                                 <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2"></div>
//                                                 <p className="text-sm">Item {item}</p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                             <FourWayDrawerClose onClick={() => setIsFullPageOpen(false)} />
//                         </FourWayDrawerContent>
//                     </>
//                 )}
//             </FourWayDrawer>
//         </div>
//     );
// };

// export default FourWayDrawerDemo;