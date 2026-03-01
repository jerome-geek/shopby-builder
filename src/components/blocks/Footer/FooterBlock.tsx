import React from 'react';

export interface FooterProps {
    companyName?: string;
    copyrightYear?: string;
}

const FooterBlock: React.FC<FooterProps> = ({
    companyName = 'Your Company',
    copyrightYear = '2026',
}) => {
    return (
        <footer className="w-full bg-gray-50 border-t py-8 mt-10">
            <div className="container mx-auto px-6 text-center text-gray-500">
                <p>
                    &copy; {copyrightYear} {companyName}. All rights reserved.
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                    <a href="#" className="hover:text-gray-900">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default FooterBlock;
