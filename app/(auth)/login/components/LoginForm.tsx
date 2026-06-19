

export function LoginForm() {

    const userLogin = async () => {
        
       const response = await fetch('/api/login', { 
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: '',
                password: ''
            })
        })

        const data = await response.json()

        if(!response.ok){
            console.log(data.error)
            return
        }
    
    }

    return (
        <div>LoginForm</div>
    )
}