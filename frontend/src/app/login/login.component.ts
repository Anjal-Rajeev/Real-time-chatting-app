import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './loginService/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true
  loginForm!: FormGroup;
  submitted = false

  status = ""

  constructor(private formBuilder:FormBuilder, private auth:LoginService, private router:Router) { }

  ngOnInit(): void {
    //validations

    this.loginForm = this.formBuilder.group({
      email:['', [Validators.required,Validators.email]],
      password:['', Validators.required]
    })
  }

  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true
    
    if(this.loginForm.invalid){
      return
    }
    else{
      // console.log(this.loginForm.value)
      let data = this.loginForm.value
      // alert(JSON.stringify(data))
      this.auth.login(data).subscribe(res=>{
        // console.log("from backend",res)
        let userData:any = res
        // console.log("from backend",userData)
        
        if(userData.status == "1"){
          console.log(userData.status)
          this.status = "Account doesn't exists"
          return
        }else if(userData.status == "2"){
          console.log(userData.status)
          this.status = "Invalid credentials"
          return
        }
        
        localStorage.setItem('token', userData[1])
        localStorage.setItem('id', userData[0][0]._id)
    
         
        this.router.navigateByUrl('home')
      })
    }
  }

}
