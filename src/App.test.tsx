import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

describe('App component', () => {
    const setup = () => {
        const input = screen.getByPlaceholderText('Add todo')
        const submitButton = screen.getByText('Submit')
        return {input, submitButton}
    }

    const addTodo = (text: string) => {
        const {input, submitButton} = setup()
        fireEvent.change(input, {target: {value: text}})
        fireEvent.click(submitButton)
    }

    it('Рендер компонента App', () => {
        render(<App />)
        expect(screen.getByText('TODOS')).toBeInTheDocument()
    })

    test('adds a new todo item', () => {
        render(<App />)
        addTodo('New Todo')
        expect(screen.getByText('New Todo')).toBeInTheDocument()
    })

    test('toggles a todo item', () => {
        render(<App />)
        addTodo('Toggle Todo')
        const checkbox = screen.getByLabelText('Toggle Todo')
        fireEvent.click(checkbox)
        expect(screen.getByText('Toggle Todo')).toHaveClass('line-through')
    })

    test('filters active todos', () => {
        render(<App />)
        addTodo('Completed Todo')
        addTodo('Active Todo')

        const checkboxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkboxes[0])

        const activeFilter = screen.getByText('Active')
        fireEvent.click(activeFilter)

        expect(screen.getByText('Active Todo')).toBeInTheDocument()
        expect(screen.queryByText('Completed Todo')).not.toBeInTheDocument()
    })

    test('filters completed todos', () => {
        render(<App />)
        addTodo('Completed Todo')
        addTodo('Active Todo')

        const checkboxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkboxes[0])

        const completedFilter = screen.getByText('Completed')
        fireEvent.click(completedFilter)

        expect(screen.getByText('Completed Todo')).toBeInTheDocument()
        expect(screen.queryByText('Active Todo')).not.toBeInTheDocument()
    })

    test('clears all completed todos', () => {
        render(<App />)
        addTodo('Completed Todo')
        addTodo('Another Todo')

        const checkboxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkboxes[0])

        const clearButton = screen.getByText('Clear')
        fireEvent.click(clearButton)

        expect(screen.getByText('Completed Todo')).not.toHaveClass('line-through')
        expect(screen.getByText('Another Todo')).not.toHaveClass('line-through')
    })
})
