// composable function to navigation to useRoute
// attempts to redirect using nuxt router, if it fails, it'll log the error

export function useNavigate() {
    
    const to = (path: string) => {
        try {
            const router = useRouter();
            router.push({ path });
        } catch (ex) {
            console.error('useNavigate: failed to navigate to ' + path, ex);
        }
    }
    
    return {
        to
    }
}


