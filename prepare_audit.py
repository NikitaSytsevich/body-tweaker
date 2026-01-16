import os
import fnmatch

# ================= КОНФИГУРАЦИЯ =================
# Папка проекта (точка для сканирования)
PROJECT_ROOT = "." 

# Папка куда сохранять дампы
OUTPUT_DIR = "./project_dump" 

# Максимум строк в одном файле-дампе (примерно)
MAX_LINES_PER_PART = 5000 

# Что игнорируем (файлы и папки) - ЭКОНОМИМ ТОКЕНЫ
IGNORE_PATTERNS = [
    # Системные и Git
    ".git", ".DS_Store", ".idea", ".vscode", "__pycache__",
    
    # Зависимости и билды
    "node_modules", "dist", "build", "coverage", "venv", "env",
    
    # Медиа и бинарники (AI они не нужны)
    "*.png", "*.jpg", "*.jpeg", "*.gif", "*.ico", "*.svg", 
    "*.mp3", "*.mp4", "*.wav", "*.pdf", "*.zip", "*.tar.gz",
    "*.pyc", "*.exe", "*.dll", "*.so",
    
    # Лок-файлы (обычно мусор для анализа логики)
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock"
]

# ================= ЛОГИКА =================

def should_ignore(path):
    """Проверяет, нужно ли игнорировать файл/папку."""
    name = os.path.basename(path)
    for pattern in IGNORE_PATTERNS:
        if fnmatch.fnmatch(name, pattern):
            return True
    return False

def get_file_tree(start_path):
    """Генерирует дерево файлов для понимания структуры."""
    tree_str = "=== PROJECT STRUCTURE ===\n"
    for root, dirs, files in os.walk(start_path):
        # Фильтрация папок на лету
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
        
        level = root.replace(start_path, '').count(os.sep)
        indent = '    ' * level
        tree_str += f"{indent}📂 {os.path.basename(root)}/\n"
        subindent = '    ' * (level + 1)
        for f in files:
            if not should_ignore(f):
                tree_str += f"{subindent}📄 {f}\n"
    tree_str += "\n=== FILE CONTENTS ===\n"
    return tree_str

def is_text_file(file_path):
    """Простая проверка, текстовый ли файл (чтобы не читать бинарники)."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            f.read(1024)
        return True
    except (UnicodeDecodeError, IOError):
        return False

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    part_num = 1
    current_lines = 0
    current_content = []
    
    # Добавляем структуру проекта в начало первой части
    print("⏳ Генерируем структуру проекта...")
    structure = get_file_tree(PROJECT_ROOT)
    current_content.append(structure)
    current_lines += structure.count('\n')

    print("🚀 Начинаем чтение файлов...")
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Игнорируем ненужные папки
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
        
        for file in files:
            file_path = os.path.join(root, file)
            
            if should_ignore(file_path):
                continue
                
            if not is_text_file(file_path):
                continue

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Формируем блок для файла
                file_block = (
                    f"\n====================\n"
                    f"START FILE: {os.path.relpath(file_path, PROJECT_ROOT)}\n"
                    f"====================\n"
                    f"{content}\n"
                    f"====================\n"
                    f"END FILE: {os.path.relpath(file_path, PROJECT_ROOT)}\n"
                    f"====================\n"
                )
                
                block_lines = file_block.count('\n')
                
                # Если текущая часть переполнится -> сохраняем и начинаем новую
                if current_lines + block_lines > MAX_LINES_PER_PART and current_lines > 0:
                    output_filename = os.path.join(OUTPUT_DIR, f"audit_part_{part_num}.txt")
                    with open(output_filename, 'w', encoding='utf-8') as out_f:
                        out_f.write("".join(current_content))
                    
                    print(f"✅ Создан файл: {output_filename} ({current_lines} строк)")
                    
                    # Сброс счетчиков
                    part_num += 1
                    current_content = []
                    current_lines = 0

                current_content.append(file_block)
                current_lines += block_lines
                
            except Exception as e:
                print(f"⚠️ Ошибка чтения файла {file_path}: {e}")

    # Записываем остаток
    if current_content:
        output_filename = os.path.join(OUTPUT_DIR, f"audit_part_{part_num}.txt")
        with open(output_filename, 'w', encoding='utf-8') as out_f:
            out_f.write("".join(current_content))
        print(f"✅ Создан файл: {output_filename} ({current_lines} строк)")

    print(f"\n🎉 Готово! Файлы для анализа лежат в папке: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
