package com.solitrix.todojava.repository;

import com.solitrix.todojava.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

// While extending the jpa repository, it has to know what entity it should interact with and what is the datatype of primary key
public interface TaskRepository extends JpaRepository<Task, Long> {
}
