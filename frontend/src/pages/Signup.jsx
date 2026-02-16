import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await registerUser(data.fullName, data.email, data.password);
            navigate('/');
        } catch (err) {
            console.error("Signup Error Details:", JSON.stringify(err.response?.data, null, 2));
            const errorMessage = err.response?.data?.detail
                ? (Array.isArray(err.response.data.detail) ? err.response.data.detail.map(e => e.msg).join(', ') : err.response.data.detail)
                : (err.message || 'Registration failed. Please try again.');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 animate-fade-in">
            <div className="glass-card p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-6 h-6 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="text-gray-400 mt-2">Join MediPredict Pro today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Full Name"
                        type="text"
                        {...register('fullName', { required: 'Full Name is required' })}
                        error={errors.fullName}
                    />
                    <Input
                        label="Email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        type="password"
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                        error={errors.password}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        {...register('confirmPassword', { required: 'Confirm Password is required' })}
                        error={errors.confirmPassword}
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button type="submit" isLoading={isLoading} className="w-full btn-primary">
                        Create Account
                    </Button>
                </form>

                <p className="text-center mt-6 text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
