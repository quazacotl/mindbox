import {FormEvent, useEffect, useState} from 'react'
import {nanoid} from 'nanoid'
import clsx from 'clsx'

// Интерфейс для объекта Todo
interface Todo {
    id: string
    text: string
    completed: boolean
}

// Тип для фильтра
type Filter = 'all' | 'active' | 'completed'

function App() {
    const [input, setInput] = useState('') // Состояние для значения ввода
    const [todos, setTodos] = useState<Todo[]>([]) // Состояние для todos
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]) // Состояние для отфильтрованных todos
    const [activeFilter, setActiveFilter] = useState<Filter>('all') // Состояние для активного фильтра

    // Эффект для фильтрации todos в зависимости от активного фильтра
    useEffect(() => {
        switch (activeFilter) {
            case 'active':
                setFilteredTodos(todos.filter((todo) => !todo.completed))
                break
            case 'completed':
                setFilteredTodos(todos.filter((todo) => todo.completed))
                break
            default:
                setFilteredTodos(todos)
        }
    }, [activeFilter, todos])

    // Обработчик отправки формы
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setTodos((prev) => [...prev, {id: nanoid(), text: input, completed: false}])
        setInput('')
    }

    // Обработчик переключения статуса завершенности todo
    const handleToggle = (todo: Todo) => {
        const todoIndex = todos.findIndex((item) => item.id === todo.id)
        setTodos((prev) => prev.toSpliced(todoIndex, 1, {id: todo.id, text: todo.text, completed: !todo.completed}))
    }

    // Обработчик очистки всех завершенных todos
    const handleClear = () => {
        setTodos(todos.map((item) => ({id: item.id, text: item.text, completed: false})))
    }

    // Количество незавершенных todos
    const getUncompletedCount = () => {
        return todos.filter((item) => !item.completed).length
    }

    return (
        <section className={'flex min-h-screen flex-col items-center bg-slate-50 p-36 dark:bg-slate-800'}>
            <h1 className={'text-5xl text-slate-500 dark:text-slate-300'}>TODOS</h1>
            <div className={'mt-6 w-8/12'}>
                <form className={'relative rounded-lg shadow-lg'} onSubmit={handleSubmit}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        placeholder='Add todo'
                        className={'input input-accent w-full'}
                    />
                    <button
                        className='btn btn-sm btn-accent absolute bottom-2 end-2 disabled:bg-gray-200 disabled:text-slate-700 dark:disabled:bg-gray-400'
                        disabled={!input}
                    >
                        Submit
                    </button>
                </form>
                {todos.length > 0 && (
                    <>
                        <div className={'mt-5 grid grid-cols-3 items-center px-4 py-3'}>
                            <p className={'grow-0'}>{`${getUncompletedCount()} items left`}</p>
                            <div role='tablist' className='tabs tabs-boxed justify-self-center'>
                                <a
                                    role='tab'
                                    className={clsx('tab', activeFilter === 'all' && 'border-accent border')}
                                    onClick={() => setActiveFilter('all')}
                                >
                                    All
                                </a>
                                <a
                                    role='tab'
                                    className={clsx('tab', activeFilter === 'active' && 'border-accent border')}
                                    onClick={() => setActiveFilter('active')}
                                >
                                    Active
                                </a>
                                <a
                                    role='tab'
                                    className={clsx('tab', activeFilter === 'completed' && 'border-accent border')}
                                    onClick={() => setActiveFilter('completed')}
                                >
                                    Completed
                                </a>
                            </div>
                            <button className='btn btn-outline btn-accent btn-sm max-w-max justify-self-end' onClick={handleClear}>
                                Clear
                            </button>
                        </div>
                        <div
                            className={
                                'mt-5 flex w-full flex-col divide-y divide-gray-300 rounded-lg border border-slate-200 bg-white text-slate-700 shadow dark:bg-gray-700 dark:text-slate-300'
                            }
                        >
                            {filteredTodos.length ? (
                                filteredTodos.map((todo) => (
                                    <div key={todo.id} className={'flex items-center gap-6 px-4 py-3'}>
                                        <input
                                            onChange={() => handleToggle(todo)}
                                            checked={!!todos.find((item) => item.id === todo.id)?.completed}
                                            type='checkbox'
                                            id={todo.id}
                                            className='checkbox checkbox-accent'
                                        />
                                        <label
                                            htmlFor={todo.id}
                                            className={clsx('text-xl', todo.completed && 'text-slate-400 line-through')}
                                        >
                                            {todo.text}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className={'px-5 py-3 text-lg'}>No items to display</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default App
