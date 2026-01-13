//
//  LoginView.swift
//  TruAi
//
//  Login and authentication view
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authService: AuthenticationService
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var isSignUp: Bool = false
    @State private var name: String = ""
    @State private var showError: Bool = false
    @State private var errorMessage: String = ""
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [Color.blue.opacity(0.6), Color.purple.opacity(0.6)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 30) {
                Spacer()
                
                // Logo and title
                VStack(spacing: 10) {
                    Image(systemName: "brain.head.profile")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 80, height: 80)
                        .foregroundColor(.white)
                    
                    Text("Tru.ai")
                        .font(.system(size: 42, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text(isSignUp ? "Create Account" : "Welcome Back")
                        .font(.headline)
                        .foregroundColor(.white.opacity(0.8))
                }
                
                // Login/Sign Up Form
                VStack(spacing: 20) {
                    if isSignUp {
                        TextField("Name", text: $name)
                            .textFieldStyle(CustomTextFieldStyle())
                            .autocapitalization(.words)
                    }
                    
                    TextField("Email", text: $email)
                        .textFieldStyle(CustomTextFieldStyle())
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(CustomTextFieldStyle())
                    
                    // Action button
                    Button(action: handleAuthentication) {
                        HStack {
                            if authService.isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Text(isSignUp ? "Sign Up" : "Login")
                                    .fontWeight(.semibold)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.white)
                        .foregroundColor(.blue)
                        .cornerRadius(12)
                    }
                    .disabled(authService.isLoading || !isFormValid)
                    .opacity((!isFormValid || authService.isLoading) ? 0.6 : 1.0)
                    
                    // Toggle between login and sign up
                    Button(action: { isSignUp.toggle() }) {
                        Text(isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up")
                            .foregroundColor(.white)
                            .font(.subheadline)
                    }
                }
                .padding(.horizontal, 40)
                
                Spacer()
                
                // Footer
                Text("© 2026 Tru.ai. All rights reserved.")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.6))
                    .padding(.bottom, 20)
            }
        }
        .alert(isPresented: $showError) {
            Alert(
                title: Text("Error"),
                message: Text(errorMessage),
                dismissButton: .default(Text("OK"))
            )
        }
    }
    
    private var isFormValid: Bool {
        if isSignUp {
            return !name.isEmpty && !email.isEmpty && !password.isEmpty && password.count >= 6
        } else {
            return !email.isEmpty && !password.isEmpty
        }
    }
    
    private func handleAuthentication() {
        Task {
            do {
                if isSignUp {
                    try await authService.signUp(name: name, email: email, password: password)
                } else {
                    try await authService.login(email: email, password: password)
                }
            } catch {
                errorMessage = error.localizedDescription
                showError = true
            }
        }
    }
}

// Custom text field style
struct CustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(Color.white.opacity(0.9))
            .cornerRadius(12)
            .foregroundColor(.primary)
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
            .environmentObject(AuthenticationService())
    }
}
