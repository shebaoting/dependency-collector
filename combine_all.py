import os

# 配置输出文件
OUTPUT_FILE = 'combined_project_code.md' # 改个名字，避免与原文件冲突
# 扫描的根目录 (当前目录)
ROOT_DIR = '.'

# 要排除的文件和目录列表 (相对于 ROOT_DIR)
EXCLUDE_PATHS_REL = [
    '.github',
    os.path.join('js', 'dist'),
    os.path.join('js', 'node_modules'),
    os.path.join('js', '.gitignore'),
    os.path.join('js', 'webpack.config.js'),
    os.path.join('js', 'yarn.lock'),
    os.path.join('js', 'tsconfig.json'),
    'tests',
    'vendor',
    '.editorconfig',
    '.gitattributes',
    '.gitignore',
    '.styleci.yml',
    'composer.lock',
    'LICENSE.md',
    'README.md',
    'combined_project_code.md',
    'combine_all.py',
    OUTPUT_FILE # 确保排除输出文件本身
]

# 将相对路径转换为规范化的绝对路径或规范化的相对路径用于比较
# 我们这里使用相对于 ROOT_DIR 的规范化路径进行比较
EXCLUDE_SET = {os.path.normpath(p) for p in EXCLUDE_PATHS_REL}

def get_language_from_extension(file_path):
    """根据文件扩展名猜测代码语言"""
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    lang_map = {
        '.py': 'python',
        '.js': 'javascript',
        '.jsx': 'jsx',
        '.ts': 'typescript',
        '.tsx': 'tsx',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.json': 'json',
        '.md': 'markdown',
        '.php': 'php',
        '.java': 'java',
        '.c': 'c',
        '.cpp': 'cpp',
        '.h': 'c', # C header
        '.hpp': 'cpp', # C++ header
        '.cs': 'csharp',
        '.go': 'go',
        '.rb': 'ruby',
        '.rs': 'rust',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.sh': 'bash',
        '.sql': 'sql',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.xml': 'xml',
        # 添加更多你需要的映射
    }
    return lang_map.get(ext, 'text') # 默认为纯文本

def write_file_to_md(md_file, file_path):
    """将指定文件的路径和内容写入Markdown文件"""
    # 写入文件路径标题，使用相对路径以保持简洁
    display_path = os.path.relpath(file_path, ROOT_DIR)
    md_file.write(f'### 文件路径: `{display_path}`\n\n')

    language = get_language_from_extension(file_path)
    # 写入代码块
    try:
        # 对于某些非文本文件，尝试读取可能会失败或产生乱码
        # 使用 errors='ignore' 可以跳过无法解码的字符，但仍可能不理想
        # 更好的做法是增加一个二进制文件检测，这里暂时简化
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f_content:
            content = f_content.read()
            md_file.write(f'```{language}\n')
            md_file.write(content)
            if not content.endswith('\n'):
                md_file.write('\n')  # 确保代码块结尾换行
            md_file.write('```\n\n')
    except Exception as e:
        md_file.write(f'```\n// 读取文件错误: {file_path}\n// {str(e)}\n```\n\n')

# --- 主逻辑 ---
with open(OUTPUT_FILE, 'w', encoding='utf-8') as md_file:
    print(f"开始扫描目录: {os.path.abspath(ROOT_DIR)}")
    print(f"排除列表: {EXCLUDE_PATHS_REL}")

    for root, dirs, files in os.walk(ROOT_DIR, topdown=True):
        # --- 目录排除 ---
        # 规范化当前 root 路径 (相对于 ROOT_DIR)
        # os.walk 返回的 root 已经是相对于你传入 os.walk 的路径了
        # 如果 ROOT_DIR 是 '.', root 会是 '.', './subdir', './subdir/subsubdir'
        norm_current_root_rel = os.path.normpath(root)

        # 1. 如果当前根目录本身就在排除列表中 (例如 'vendor' 目录)
        if norm_current_root_rel != '.' and norm_current_root_rel in EXCLUDE_SET: # root 为 '.' 时不应被排除
            print(f"  跳过整个被排除的目录 (及其子项): {root}")
            dirs[:] = []  # 清空 dirs, 防止 os.walk 进入这个目录的子目录
            continue      # 跳过处理此目录下的文件

        # 2. 从 dirs 列表中移除需要排除的子目录
        #    需要修改 dirs 列表本身 (dirs[:]) 才能影响 os.walk 的后续行为
        dirs_to_remove = []
        for d in dirs:
            dir_path_rel = os.path.normpath(os.path.join(root, d))
            if dir_path_rel in EXCLUDE_SET:
                dirs_to_remove.append(d)

        if dirs_to_remove:
            for d_rem in dirs_to_remove:
                print(f"  从 {root} 中排除子目录: {d_rem}")
                dirs.remove(d_rem)

        # --- 文件处理与排除 ---
        for file_name in files:
            file_path_abs = os.path.join(root, file_name) # 这是相对于 ROOT_DIR 的路径
            norm_file_path_rel = os.path.normpath(file_path_abs)

            if norm_file_path_rel in EXCLUDE_SET:
                print(f"  跳过排除的文件: {file_path_abs}")
                continue

            # 确保文件不是位于一个本应被排除的父目录中（双重检查，主要由上面的目录排除处理）
            # 例如，如果 'vendor' 被排除，则 'vendor/autoload.php' 不应被处理
            # 这个检查有点冗余，因为如果父目录被正确排除了，os.walk根本不会进入
            # 但如果排除的是 `a/b/c` 这样的深层路径，而当前 `root` 是 `a/b`，则 `c` 会被从`dirs`移除
            # 如果排除的是 `a/b`，当 `root` 是 `a` 时，`b` 会被从 `dirs` 移除。
            # 当 `root` 是 `a/b` 时，它会被第一个检查 (`norm_current_root_rel in EXCLUDE_SET`) 捕获。

            print(f"  处理文件: {file_path_abs}")
            write_file_to_md(md_file, file_path_abs)

print(f"\n生成完成！输出文件: {OUTPUT_FILE}")