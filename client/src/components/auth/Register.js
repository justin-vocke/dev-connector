import React, { Fragment, useState } from 'react'
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({setAlert, register, isAuthenticated}) => {

    const [formData, setFormData]= useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });

    const {name, email, password, password2} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2){
            setAlert('passwords do not match', 'danger');
        }
        else{
           register({name, email, password});
            
        }
    }

    //if registration is successful
    if(isAuthenticated){
        return <Redirect to = '/dashboard' />;
    }

    return (
<Fragment>
        <h1 className="large text-primary">Sign Up</h1>
    <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
    <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
        <input 
            type="text"
            placeholder="Name" 
            onChange = {e => onChange(e)} 
            value = {name} 
            name="name" 
            required 
        />
        
        </div>
        <div className="form-group">
        <input 
            type="email" 
            placeholder="Email Address"
            onChange = {e => onChange(e)} 
            value = {email} 
            name="email" 
            required
        />
        <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
        >
        </div>
        <div className="form-group">
        <input
            type="password"
            placeholder="Password"
            onChange = {e => onChange(e)} 
            value = {password} 
            name="password"
            minLength="6"
        />
        </div>
        <div className="form-group">
        <input
            type="password"
            placeholder="Confirm Password"
            onChange = {e => onChange(e)} 
            value = {password2} 
            name="password2"
            minLength="6"
        />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
    </form>
    <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
    </p>
</Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, {setAlert, register})(Register);
