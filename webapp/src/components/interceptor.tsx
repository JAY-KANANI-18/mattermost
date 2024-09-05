import React, { useEffect } from 'react';

const InterceptorComponent: React.FC = () => {
    useEffect(() => {
        // Save the original fetch function
        const originalFetch = window.fetch;
        type Args = [RequestInfo, RequestInit?];

        // Override the global fetch function
        window.fetch = async (...args: [RequestInfo | URL, RequestInit?]) => {
            // Call the original fetch function
            let url: string;

            if (typeof args[0] === 'string') {
                url = args[0];
            } else if (args[0] instanceof Request) {
                url = args[0].url;
            } else {
                // If neither a string nor a Request object, call the original fetch
                return originalFetch(...args);
            }

            const response = await originalFetch(...args);

            // Clone the response to modify it
            const clonedResponse = response.clone();

            // Check if the URL includes the specific path
            const data = await clonedResponse.json();
            console.log({data});
            if (url.includes('/api/v4/users')) {




                // Modify the response data
                // data.customField = 'Modified Data';

                // // Create a new Response object with modified data
                // const modifiedResponse = new Response(JSON.stringify(data), {
                //     status: response.status,
                //     statusText: response.statusText,
                //     headers: response.headers,
                // });

                return data;
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
