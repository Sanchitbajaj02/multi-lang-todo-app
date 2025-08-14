package com.solitrix.todojava.controller;

import com.solitrix.todojava.model.Task;
import com.solitrix.todojava.services.TaskService;
import jakarta.websocket.server.PathParam;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
//@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public String getTasks(Model model) {
        List<Task> tasks = taskService.getAllTasks();
        model.addAttribute("tasks", tasks);
        return "tasks";
    }

    @PostMapping
    public String createTask(@RequestParam String title, @RequestParam String description) {
        taskService.createTask(title, description);
        return "redirect:/";
    }

    @GetMapping("/{taskId}/delete")
    public String deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return "redirect:/";
    }

    @GetMapping("/{taskId}/toggle")
    public String toggleTask(@PathVariable Long taskId) {
        taskService.toggleTask(taskId);
        return "redirect:/";
    }
}
