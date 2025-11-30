import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import emptyStateImage from "@assets/generated_images/minimalist_abstract_productivity_illustration.png";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Initialize with some dummy data for the mockup
    return [
      { id: "1", text: "Review project requirements", completed: true, createdAt: Date.now() },
      { id: "2", text: "Draft initial design concepts", completed: false, createdAt: Date.now() },
      { id: "3", text: "Set up development environment", completed: false, createdAt: Date.now() },
    ];
  });
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-lg space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-primary font-heading">
              Simple Tasks
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(), "EEEE, MMMM do, yyyy")}
            </p>
          </motion.div>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5 backdrop-blur-sm bg-card/95 overflow-hidden">
          <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
            <form onSubmit={addTodo} className="relative flex items-center">
              <Input
                type="text"
                placeholder="What needs to be done?"
                className="pl-4 pr-12 py-6 text-lg bg-background border-transparent focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                data-testid="input-new-todo"
              />
              <Button 
                type="submit" 
                size="icon"
                className="absolute right-2 w-8 h-8 rounded-full transition-transform hover:scale-105 active:scale-95"
                disabled={!inputValue.trim()}
                data-testid="button-add-todo"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </form>
          </CardHeader>

          <CardContent className="p-0">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/5">
              <div className="flex items-center gap-2">
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                  <TabsList className="h-9 bg-muted/50">
                    <TabsTrigger value="all" className="text-xs px-3" data-testid="filter-all">All</TabsTrigger>
                    <TabsTrigger value="active" className="text-xs px-3" data-testid="filter-active">Active</TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs px-3" data-testid="filter-completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {stats.active} tasks remaining
              </div>
            </div>

            {/* Todo List */}
            <div className="min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-hide p-2">
              <AnimatePresence mode="popLayout">
                {filteredTodos.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center h-64 text-center p-8 space-y-4"
                  >
                    <div className="relative w-48 h-48 opacity-80 hover:opacity-100 transition-opacity duration-500">
                        <img 
                          src={emptyStateImage} 
                          alt="No tasks" 
                          className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-foreground">No tasks found</h3>
                      <p className="text-sm text-muted-foreground">
                        {filter === "all" 
                          ? "You're all caught up! Enjoy your day." 
                          : `No ${filter} tasks right now.`}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <ul className="space-y-1">
                    {filteredTodos.map((todo) => (
                      <motion.li
                        key={todo.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/30"
                        data-testid={`todo-item-${todo.id}`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Checkbox
                            id={`todo-${todo.id}`}
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            className="w-5 h-5 rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-muted-foreground/30 transition-all duration-300"
                            data-testid={`checkbox-todo-${todo.id}`}
                          />
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={`text-sm sm:text-base cursor-pointer select-none truncate transition-all duration-300 ${
                              todo.completed
                                ? "text-muted-foreground line-through decoration-border"
                                : "text-foreground font-medium"
                            }`}
                          >
                            {todo.text}
                          </label>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity h-8 w-8 rounded-full"
                          data-testid={`button-delete-${todo.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {todos.some(t => t.completed) && (
              <div className="p-4 border-t border-border/40 bg-muted/10 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCompleted}
                  className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-testid="button-clear-completed"
                >
                  Clear completed tasks
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <footer className="text-center text-xs text-muted-foreground/50 pt-8">
          <p>Press Enter to add a task</p>
        </footer>
      </div>
    </div>
  );
}
