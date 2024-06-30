class AuthService {
    private token: string | null = null

    setToken(token: string): void {
        this.token = token
        localStorage.setItem('jwtToken', token)
    }

    getToken(): string | null {
        this.token = localStorage.getItem('jwtToken')
        return this.token
    }

    isAuthenticated(): boolean {
        return this.token !== null
    }

    logout(): void {
        this.token = null
        localStorage.removeItem('jwtToken')
    }
}

export default new AuthService()