/**
 * Centralized fetch wrapper to handle automatic token refresh on 401 errors.
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
    // Ensure credentials are included by default for HttpOnly cookies
    const isFormData = options.body instanceof FormData;
    const defaultOptions: RequestInit = {
        ...options,
        credentials: options.credentials || 'include',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...options.headers,
        },
    };

    // Add Authorization header if token exists in sessionStorage
    const token = sessionStorage.getItem('access_token');
    if (token && !defaultOptions.headers?.['Authorization' as keyof typeof defaultOptions.headers]) {
        (defaultOptions.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, defaultOptions);

    // If 401 Unauthorized, try to refresh the token
    if (response.status === 401) {
        const refreshToken = sessionStorage.getItem('refresh_token');

        if (refreshToken) {
            try {
                const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                    credentials: 'include',
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();

                    // Store new tokens in sessionStorage
                    sessionStorage.setItem('access_token', data.session.access_token);
                    sessionStorage.setItem('refresh_token', data.session.refresh_token);

                    // Retry original request with new token
                    (defaultOptions.headers as any)['Authorization'] = `Bearer ${data.session.access_token}`;
                    response = await fetch(url, defaultOptions);
                } else {
                    // Refresh failed, possibly invalid refresh token
                    handleSessionExpired();
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                handleSessionExpired();
            }
        } else {
            // No refresh token available
            handleSessionExpired();
        }
    }

    return response;
}

function handleSessionExpired() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    // We can't use router here as this is a plain TS file, 
    // but window.location will work to force a redirect.
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login?redirect=' + window.location.pathname;
    }
}
