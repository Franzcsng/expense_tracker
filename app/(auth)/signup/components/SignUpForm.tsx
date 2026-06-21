


export function SignUpForm() {
    
    const submitSignup = async () => {

        const response = await fetch('/api/login', { 
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: '',
                password: '',
                firstName: '',
                lastName: ''
            })
        })

        const data = await response.json()

        if(!response.ok){
            console.log(data.error)
            return
        }
    }
 
    return (
        <div>SignUpForm</div>
    )
}