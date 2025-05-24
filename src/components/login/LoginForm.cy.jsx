import React from 'react'
import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '../../../src/components/login/LoginForm'
import { AuthContext } from '../../../src/Context/AuthContext'

describe('LoginForm Component', () => {
  it('muestra el mensaje de error cuando las credenciales son inválidas', () => {
    const mockLogin = cy.stub().as('login')
    const mockOnSwitchToRegister = cy.stub().as('onSwitchToRegister')
    const mockOnSwitchToForgotPassword = cy.stub().as('onSwitchToForgotPassword')

    const AuthProviderMock = ({ children }) => {
      const [error, setError] = React.useState(null)
      
      const handleLogin = async (email, password) => {
        await mockLogin(email, password)
        setError(401)
      }

      return (
        <AuthContext.Provider value={{ login: handleLogin, error }}>
          {children}
        </AuthContext.Provider>
      )
    }

    mount(
      <MemoryRouter>
        <AuthProviderMock>
          <LoginForm
            onSwitchToRegister={mockOnSwitchToRegister}
            onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
          />
        </AuthProviderMock>
      </MemoryRouter>
    )

    cy.get('input[name="email"]').type('JoseSLK')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('form').submit()

    // Verificar que se llamó a login
    cy.get('@login').should('have.been.calledWith', 'JoseSLK', 'wrongpassword')

    // Esperar a que el mensaje de error aparezca
    cy.get('.dou-login-error', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Contraseña incorrecta')
  })

  it('maneja el login exitoso correctamente', () => {
    const mockLogin = cy.stub().as('login')
    const mockOnSwitchToRegister = cy.stub().as('onSwitchToRegister')
    const mockOnSwitchToForgotPassword = cy.stub().as('onSwitchToForgotPassword')

    const AuthProviderMock = ({ children }) => {
      const [error, setError] = React.useState(null)
      
      const handleLogin = async (email, password) => {
        await mockLogin(email, password)
        // No establecemos error para simular login exitoso
      }

      return (
        <AuthContext.Provider value={{ login: handleLogin, error }}>
          {children}
        </AuthContext.Provider>
      )
    }

    mount(
      <MemoryRouter>
        <AuthProviderMock>
          <LoginForm
            onSwitchToRegister={mockOnSwitchToRegister}
            onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
          />
        </AuthProviderMock>
      </MemoryRouter>
    )

    cy.get('input[name="email"]').type('JoseSLK')
    cy.get('input[name="password"]').type('password123@')
    cy.get('form').submit()

    // Verificar que se llamó a login con las credenciales correctas
    cy.get('@login').should('have.been.calledWith', 'JoseSLK', 'password123@')

    // Verificar que no hay mensaje de error
    cy.get('.dou-login-error').should('not.exist')
  })

  it('muestra error cuando el usuario no está registrado', () => {
    const mockLogin = cy.stub().as('login')
    const mockOnSwitchToRegister = cy.stub().as('onSwitchToRegister')
    const mockOnSwitchToForgotPassword = cy.stub().as('onSwitchToForgotPassword')

    const AuthProviderMock = ({ children }) => {
      const [error, setError] = React.useState(null)
      
      const handleLogin = async (email, password) => {
        await mockLogin(email, password)
        setError(404)
      }

      return (
        <AuthContext.Provider value={{ login: handleLogin, error }}>
          {children}
        </AuthContext.Provider>
      )
    }

    mount(
      <MemoryRouter>
        <AuthProviderMock>
          <LoginForm
            onSwitchToRegister={mockOnSwitchToRegister}
            onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
          />
        </AuthProviderMock>
      </MemoryRouter>
    )

    cy.get('input[name="email"]').type('nonexistent@user.com')
    cy.get('input[name="password"]').type('anypassword')
    cy.get('form').submit()

    // Verificar que se llamó a login
    cy.get('@login').should('have.been.calledWith', 'nonexistent@user.com', 'anypassword')

    // Esperar a que el mensaje de error aparezca
    cy.get('.dou-login-error', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Usuario no encontrado')
  })

  it('bloquea la cuenta después de múltiples intentos fallidos', () => {
    const mockLogin = cy.stub().as('login')
    const mockOnSwitchToRegister = cy.stub().as('onSwitchToRegister')
    const mockOnSwitchToForgotPassword = cy.stub().as('onSwitchToForgotPassword')

    const AuthProviderMock = ({ children }) => {
      const [error, setError] = React.useState(null)
      const [attempts, setAttempts] = React.useState(0)
      
      const handleLogin = async (email, password) => {
        await mockLogin(email, password)
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        
        // Simular bloqueo después del tercer intento
        if (newAttempts >= 3) {
          setError(403)
        } else {
          setError(401)
        }
      }

      return (
        <AuthContext.Provider value={{ login: handleLogin, error }}>
          {children}
        </AuthContext.Provider>
      )
    }

    mount(
      <MemoryRouter>
        <AuthProviderMock>
          <LoginForm
            onSwitchToRegister={mockOnSwitchToRegister}
            onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
          />
        </AuthProviderMock>
      </MemoryRouter>
    )

    // Función para realizar un intento de login
    const attemptLogin = (expectedError) => {
      cy.get('input[name="email"]').clear().type('JoseSLK')
      cy.get('input[name="password"]').clear().type('wrongpassword')
      cy.get('form').submit()
      cy.get('@login').should('have.been.calledWith', 'JoseSLK', 'wrongpassword')
      
      // Esperar a que el mensaje de error aparezca
      cy.get('[data-testid="error-message"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', expectedError)
    }

    // Realizar los intentos
    attemptLogin('Contraseña incorrecta')
    attemptLogin('Contraseña incorrecta')
    attemptLogin('Tu cuenta ha sido bloqueada')

    // Verificar que se llamó a login tres veces
    cy.get('@login').should('have.been.calledThrice')
  })

  it('muestra el estado de carga durante el login', () => {
    const mockLogin = cy.stub().as('login')
    const mockOnSwitchToRegister = cy.stub().as('onSwitchToRegister')
    const mockOnSwitchToForgotPassword = cy.stub().as('onSwitchToForgotPassword')

    const AuthProviderMock = ({ children }) => {
      const [error, setError] = React.useState(null)
      
      const handleLogin = async (email, password) => {
        await mockLogin(email, password)
        // Simulamos un delay para ver el estado de carga
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      return (
        <AuthContext.Provider value={{ login: handleLogin, error }}>
          {children}
        </AuthContext.Provider>
      )
    }

    mount(
      <MemoryRouter>
        <AuthProviderMock>
          <LoginForm
            onSwitchToRegister={mockOnSwitchToRegister}
            onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
          />
        </AuthProviderMock>
      </MemoryRouter>
    )

    cy.get('input[name="email"]').type('JoseSLK')
    cy.get('input[name="password"]').type('password123@')
    cy.get('form').submit()

    // Verificar que el botón muestra el estado de carga
    cy.get('.dou-login-button-submit')
      .should('be.disabled')
      .and('contain', 'Cargando...')

    // Verificar que se llamó a login
    cy.get('@login').should('have.been.calledWith', 'JoseSLK', 'password123@')
  })
})
