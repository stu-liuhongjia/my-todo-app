//机器人1903869855: 04-27 20:29:17
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
// Initialize Supabase client
const supabaseUrl = process.env.NEXTPUBLICSUPABASE_URL;
const supabaseAnonKey = process.env.NEXTPUBLICSUPABASEANONKEY;
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  // Load todos from Supabase on component mount
  useEffect(() => {
    fetchTodos();
    
    // Set up real-time subscription
    if (supabase) {
      const channel = supabase
        .channel('changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'todos',
          },
          (payload) => {
            setTodos((prev) => [...prev, payload.new]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'todos',
          },
          (payload) => {
            setTodos((prev) =>
              prev.map((todo) =>
                todo.id === payload.new.id ? payload.new : todo
              )
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'todos',
          },
          (payload) => {
            setTodos((prev) => prev.filter((todo) => todo.id !== payload.old.id));
          }
        )
        .subscribe();
      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, []);
  const fetchTodos = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    } finally {
      setLoading(false);
    }
  };
  const addTodo = async () => {
    if (!newTodo.trim() || !supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text: newTodo.trim(), completed: false }])
        .select()
        .single();
      
      if (error) throw error;
      
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  };
  const toggleTodo = async (id, completed) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling todo:', error.message);
    }
  };
  const deleteTodo = async (id) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };
  return (
    <div className="container">
      <div className="header">
        <h1>我的待办清单</h1>
      </div>
      
      <div className="input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="输入新任务..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-button" onClick={addTodo}>
          添加
        </button>
      </div>
      
      {loading ? (
        <p>加载中...</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <span
                className={todo-text ${
                  todo.completed ? 'completed' : ''
                }}
                {todo.text}
              </span>
              <button
                className="delete-button"
                onClick={() => deleteTodo(todo.id)}
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {todos.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888' }}>
          暂无待办事项，添加一个试试吧！
        </p>
      )}

机器人1903869855: 04-27 20:29:18
</div>
  );
}
点击 "Commit new file"
创建 app/globals.css
文件路径：app/globals.css
内容：
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
}
.header {
  text-align: center;
  margin-bottom: 30px;
}
.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
.add-button {
  padding: 10px 20px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.add-button:hover {
  background-color: #0060e0;
}
.todo-list {
  list-style-type: none;
  padding: 0;
}
.todo-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.todo-item:last-child {
  border-bottom: none;
}
.todo-checkbox {
  margin-right: 15px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.todo-text {
  flex: 1;
  font-size: 16px;
}
.todo-text.completed {
  text-decoration: line-through;
  color: #888;
}
.delete-button {
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}
.delete-button:hover {
  background-color: #cc0000;
}
点击 "Commit new file"
创建 .env.local
文件路径：.env.local
内容：
Supabase 配置
NEXTPUBLICSUPABASE_URL=https://dcvxksujtogbcmfhjns.supabase.co
NEXTPUBLICSUPABASEANONKEY=sbpublishableiSXGhoT978MHQCtYP9opwzX6c6LG4
点击 "Commit new file"
创建 README.md
文件路径：README.md
内容：
Todo List App
这是一个使用 Next.js 和 Supabase 构建的简单待办清单应用程序。
功能特性
添加新的待办事项
标记待办事项为完成状态
删除待办事项
数据持久化存储在 Supabase 数据库中
实时同步（通过 Supabase 的实时功能）
技术栈
Next.js 14
React
Supabase
CSS
环境要求
Node.js 18+
npm 或 yarn
安装与运行
克隆或下载此项目到本地
安装依赖包：
``bash
npm install
或者
yarn install
创建 Supabase 账户并获取 API 凭据（详情见下文）
在项目根目录创建 .env.local 文件，并填入 Supabase 凭据：
NEXTPUBLICSUPABASEURL=yoursupabaseurlhere
NEXTPUBLICSUPABASEANONKEY=yoursupabaseanonkeyhere
启动开发服务器：
npm run dev
或者
yarn dev
在浏览器中打开 http://localhost:3000 查看应用
Supabase 设置指南
访问 Supabase 并注册账户
创建一个新的项目
在项目仪表板中找到 "Settings" -> "API"
复制 "Project URL" 和 " anon key"，分别对应 .env.local 中的 NEXTPUBLICSUPABASEURL 和 NEXTPUBLICSUPABASEANON_KEY
在 Supabase SQL 编辑器中运行以下 SQL 创建 todos 表：
CREATE TABLE todos (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to own todos" ON todos FOR ALL USING (true);
部署到 Vercel
确保项目已推送至 GitHub/GitLab/Bitbucket 仓库
访问 Vercel 并登录
点击 "New Project" 并导入你的仓库
在项目设置中添加环境变量：
   NEXTPUBLICSUPABASE_URL: 你的 Supabase 项目 URL
   NEXTPUBLICSUPABASEANONKEY: 你的 Supabase 匿名密钥
点击 "Deploy" 开始部署
部署完成后，你将获得一个类似 https://your-project-name.vercel.app 的 URL
项目结构
app/
├── layout.js     # 页面布局
├── page.js       # 主页组件
└── globals.css   # 全局样式
自定义
你可以根据需要修改样式、功能或添加更多待办事项属性（如截止日期、优先级等）。
点击 "Commit new file"
创建 database.sql
文件路径：database.sql
内容：
`sql
-- SQL 脚本：创建 todos 表
-- 创建 todos 表
CREATE TABLE todos (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);
-- 启用行级安全
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
-- 创建策略：允许所有用户访问（在开发环境中使用，生产环境请更严格控制权限）
CREATE POLICY "Allow full access to own todos" ON todos FOR ALL USING (true);
点击 "Commit new file"
创建 .gitignore
文件路径：.gitignore
内容：
Dependencies
node_modules/
Environment variables
.env.local
.env
Next.js
.next/
out/
Build
dist/
build/
OS generated files
.DS_Store
Thumbs.db
Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
Coverage directory used by tools like istanbul
coverage/
Temporary folders
tmp/
temp/
点击 "Commit new file"
第三步：克隆仓库到本地（可选）
如果你想在本地开发，可以：
复制仓库的 HTTPS URL（例如：https://github.com/你的用户名/my-todo-app.git）
在终端运行：
git clone https://github.com/你的用户名/my-todo-app.git
cd my-todo-app
npm install
npm run dev
现在你的项目已经成功上传到 GitHub，可以通过 https://github.com/你的用户名/my-todo-app` 访问了！
