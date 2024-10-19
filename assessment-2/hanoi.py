import time
import tkinter as tk

class TowerOfHanoi:
    def __init__(self, num_disks):
        self.num_disks = num_disks
        self.moves = []

    def solve(self, n, source, auxiliary, destination):
        if n == 1:
            self.moves.append((source, destination))
        else:
            self.solve(n - 1, source, destination, auxiliary)
            self.moves.append((source, destination))
            self.solve(n - 1, auxiliary, source, destination)

    def get_moves(self):
        self.solve(self.num_disks, 'A', 'B', 'C')
        return self.moves

class HanoiGUI:
    def __init__(self, root, num_disks):
        self.root = root
        self.num_disks = num_disks
        self.pegs = {'A': [], 'B': [], 'C': []}
        self.setup_pegs()

        self.root.attributes('-fullscreen', True)
        self.root.bind("<Escape>", self.exit_fullscreen)

        self.screen_width = self.root.winfo_screenwidth()
        self.screen_height = self.root.winfo_screenheight()

        self.main_frame = tk.Frame(self.root)
        self.main_frame.pack(fill=tk.BOTH, expand=True)

        self.move_count_title = tk.Label(self.main_frame, text="Moves: 0", font=("Helvetica", 24), bg="white")
        self.move_count_title.place(relx=0.5, rely=0.02, anchor="n")

        self.canvas = tk.Canvas(self.main_frame, width=self.screen_width, height=self.screen_height * 0.8)
        self.canvas.pack(pady=(60, 0))

        self.peg_positions = {
            'A': self.screen_width // 4,
            'B': self.screen_width // 2,
            'C': 3 * self.screen_width // 4
        }

        self.draw_pegs()
        self.draw_disks()

        self.move_count = 0

    def setup_pegs(self):
        
        for i in range(self.num_disks, 0, -1):
            self.pegs['A'].append(i)

    def draw_pegs(self):
        peg_height = self.screen_height * 0.45
        peg_width = 10

        # Draw pegs
        for peg, x in self.peg_positions.items():
            self.canvas.create_line(x, self.screen_height * 0.3, x, self.screen_height * 0.75, width=peg_width)

    def draw_disks(self):
        self.canvas.delete("disk")
        max_disk_width = self.screen_width // 8
        disk_height = 50

        for peg, disks in self.pegs.items():
            x = self.peg_positions[peg]
            for i, disk in enumerate(disks):

                disk_width = (max_disk_width // self.num_disks) * disk
                y = self.screen_height * 0.75 - (i * disk_height)
                self.canvas.create_rectangle(x - disk_width // 2, y - disk_height, x + disk_width // 2, y, fill="purple", tags="disk", outline="black")

    def move_disk(self, from_peg, to_peg):
        disk = self.pegs[from_peg].pop()
        self.pegs[to_peg].append(disk)
        self.draw_disks()
        self.move_count += 1
        self.update_move_count()
        self.root.update()
        time.sleep(0.5)

    def update_move_count(self):
        self.move_count_title.config(text=f"Moves: {self.move_count}")

    def exit_fullscreen(self, event=None):
        self.root.attributes("-fullscreen", False)

def play_game(num_disks):
    root = tk.Tk()
    root.title("Tower of Hanoi")

    game = TowerOfHanoi(num_disks)
    moves = game.get_moves()

    gui = HanoiGUI(root, num_disks)

    for move in moves:
        gui.move_disk(*move)

    root.mainloop()

# You can configure the number of disks up to 10
play_game(4)