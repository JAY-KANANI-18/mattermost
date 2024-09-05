import React, { useEffect } from 'react';

const InterceptorComponent: React.FC = () => {
    useEffect(() => {
        // Save the original fetch function
        const originalFetch = window.fetch;

        // Override the global fetch function
        window.fetch = async (...args: [RequestInfo | URL, RequestInit?]) => {
            let url: string;

            // Handle different types for args[0]
            if (typeof args[0] === 'string') {
                url = args[0];
            } else if (args[0] instanceof Request) {
                url = args[0].url;  // Extract URL from Request object
            } else if (args[0] instanceof URL) {
                url = args[0].toString();  // Convert URL to string
                args[0] = url;  // Update args[0] to be a string
            } else {
                return originalFetch(args[0],args[1]);
            }

            // Call the original fetch
            const response = await originalFetch(args[0], args[1]);

            // Clone the response to modify it
            const clonedResponse = response.clone();

            // Check if the URL includes the specific path
            if (url.includes('/api/v4/users')) {
                const data = await clonedResponse.json();

                console.log({data});


                // Modify the response data
                data.customField = 'Modified Data';

                // Create a new Response object with modified data
                const modifiedResponse = new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                });

                return modifiedResponse;
            }

            return response;
        };

        // Restore original fetch function when component unmounts
        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    return null;
};

export default InterceptorComponent;
