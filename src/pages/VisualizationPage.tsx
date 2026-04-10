import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Code2, Eye, BookText } from 'lucide-react';
import type { ConceptType } from '../App';
import ControlsPanel from '../components/ControlsPanel';
import StoryPanel from '../components/StoryPanel';
import BinarySearchVisualizer from '../components/visualizers/BinarySearchVisualizer';
import StackVisualizer from '../components/visualizers/StackVisualizer';
import LinkedListVisualizer from '../components/visualizers/LinkedListVisualizer';
import BinaryTreeVisualizer from '../components/visualizers/BinaryTreeVisualizer';
import LearnPanel from '../components/LearnPanel';

interface VisualizationPageProps {
  concept: ConceptType;
  onBack: () => void;
}

export interface VisualizerProps {
  isPlaying: boolean;
  speed: number;
  stepTrigger: number;
  resetTrigger: number;
  onStoryUpdate: (story: string) => void;
  onComplete: () => void;
}

type Language = 'javascript' | 'python' | 'java' | 'cpp';

const CODE_SNIPPETS: Record<ConceptType, Record<Language, string>> = {
  'binary-search': {
    javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target: return mid
        elif arr[mid] < target: left = mid + 1
        else: right = mid - 1
        
    return -1`,
    java: `int binarySearch(int arr[], int target) {
    int left = 0, right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
  },
  'stack': {
    javascript: `class Stack {
  constructor() { this.items = []; }
  push(element) { this.items.push(element); }
  pop() {
    if (this.items.length === 0) return "Underflow";
    return this.items.pop();
  }
  peek() { return this.items[this.items.length - 1]; }
}`,
    python: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, element):
        self.items.append(element)
    def pop(self):
        if not self.items: return "Underflow"
        return self.items.pop()
    def peek(self):
        if not self.items: return None
        return self.items[-1]`,
    java: `import java.util.ArrayList;

class Stack<T> {
    private ArrayList<T> items = new ArrayList<>();
    public void push(T element) { items.add(element); }
    public T pop() {
        if (items.isEmpty()) throw new RuntimeException("Underflow");
        return items.remove(items.size() - 1);
    }
    public T peek() {
        if (items.isEmpty()) return null;
        return items.get(items.size() - 1);
    }
}`,
    cpp: `#include <vector>
#include <stdexcept>

template <typename T>
class Stack {
private:
    std::vector<T> items;
public:
    void push(T element) { items.push_back(element); }
    T pop() {
        if (items.empty()) throw std::underflow_error("Underflow");
        T top = items.back();
        items.pop_back();
        return top;
    }
    T peek() {
        if (items.empty()) throw std::underflow_error("Empty");
        return items.back();
    }
};`
  },
  'linked-list': {
    javascript: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }
  insert(data) {
    let newNode = new Node(data);
    if (!this.head) { this.head = newNode; return; }
    let current = this.head;
    while (current.next) current = current.next;
    current.next = newNode;
  }
}`,
    python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    def insert(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node`,
    java: `class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

class LinkedList {
    Node head;
    void insert(int data) {
        Node newNode = new Node(data);
        if (head == null) { head = newNode; return; }
        Node current = head;
        while (current.next != null) current = current.next;
        current.next = newNode;
    }
}`,
    cpp: `struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
    Node* head;
public:
    LinkedList() : head(nullptr) {}
    void insert(int data) {
        Node* newNode = new Node(data);
        if (!head) { head = newNode; return; }
        Node* current = head;
        while (current->next) current = current->next;
        current->next = newNode;
    }
};`
  },
  'binary-tree': {
    javascript: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function inorderTraversal(root) {
  if (root !== null) {
    inorderTraversal(root.left);
    console.log(root.value);
    inorderTraversal(root.right);
  }
}`,
    python: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def inorder_traversal(root):
    if root:
        inorder_traversal(root.left)
        print(root.value)
        inorder_traversal(root.right)`,
    java: `class TreeNode {
    int value;
    TreeNode left, right;
    TreeNode(int value) { this.value = value; }
}

void inorderTraversal(TreeNode root) {
    if (root != null) {
        inorderTraversal(root.left);
        System.out.println(root.value);
        inorderTraversal(root.right);
    }
}`,
    cpp: `struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

void inorderTraversal(TreeNode* root) {
    if (root) {
        inorderTraversal(root->left);
        cout << root->value << endl;
        inorderTraversal(root->right);
    }
}`
  }
};

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++'
};

const LANGUAGE_EXTENSIONS: Record<Language, string> = {
  javascript: 'js',
  python: 'py',
  java: 'java',
  cpp: 'cpp'
};

export default function VisualizationPage({ concept, onBack }: VisualizationPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepTrigger, setStepTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [currentStory, setCurrentStory] = useState("Welcome to the visualization! Press Play or Step to begin.");
  const [viewMode, setViewMode] = useState<'learn' | 'visual' | 'code'>('learn');
  const [language, setLanguage] = useState<Language>('javascript');

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleStep = () => {
    setIsPlaying(false);
    setStepTrigger(prev => prev + 1);
  };
  const handleReset = () => {
    setIsPlaying(false);
    setResetTrigger(prev => prev + 1);
    setCurrentStory("Visualization reset. Ready to start again.");
  };
  const handleComplete = () => setIsPlaying(false);

  const renderVisualizer = () => {
    const props: VisualizerProps = {
      isPlaying,
      speed,
      stepTrigger,
      resetTrigger,
      onStoryUpdate: setCurrentStory,
      onComplete: handleComplete,
    };

    switch (concept) {
      case 'binary-search':
        return <BinarySearchVisualizer {...props} />;
      case 'stack':
        return <StackVisualizer {...props} />;
      case 'linked-list':
        return <LinkedListVisualizer {...props} />;
      case 'binary-tree':
        return <BinaryTreeVisualizer {...props} />;
      default:
        return <div>Concept not found</div>;
    }
  };

  const getConceptTitle = () => {
    switch (concept) {
      case 'binary-search': return 'Binary Search';
      case 'stack': return 'Stack';
      case 'linked-list': return 'Linked List';
      case 'binary-tree': return 'Binary Tree';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between border-b border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-display font-bold">{getConceptTitle()}</h2>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-[var(--color-dark-border)]">
          <button
            onClick={() => setViewMode('learn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'learn' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <BookText className="w-4 h-4" /> Learn
          </button>
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'visual' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <Eye className="w-4 h-4" /> Visual
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'code' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <Code2 className="w-4 h-4" /> Code
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Visualization/Code Canvas */}
        <div className="flex-1 relative bg-[var(--color-dark-bg)] overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            {viewMode === 'learn' ? (
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex"
              >
                <LearnPanel concept={concept} onStartVisual={() => setViewMode('visual')} />
              </motion.div>
            ) : viewMode === 'visual' ? (
              <motion.div
                key="visual"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center p-4"
              >
                {renderVisualizer()}
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full max-w-4xl p-8 flex flex-col items-center justify-center mx-auto"
              >
                {/* Language Selector */}
                <div className="flex gap-2 mb-4 self-start">
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
                        language === lang
                          ? 'bg-[var(--color-blue)] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          : 'bg-black/40 text-gray-400 border border-[var(--color-dark-border)] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {LANGUAGE_LABELS[lang]}
                    </button>
                  ))}
                </div>

                <div className="w-full bg-[#0d0d0d] border border-[var(--color-dark-border)] rounded-xl overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[var(--color-dark-border)]">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs font-mono text-gray-400">{concept}.{LANGUAGE_EXTENSIONS[language]}</span>
                  </div>
                  <pre className="p-6 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
                    <code>{concept ? CODE_SNIPPETS[concept][language] : ''}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar (Story & Controls) */}
        {viewMode === 'visual' && (
          <div className="w-full md:w-96 flex flex-col border-l border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] z-10">
            <div className="flex-1 overflow-y-auto p-6">
              <StoryPanel story={currentStory} />
            </div>
            <div className="p-6 border-t border-[var(--color-dark-border)] bg-[#0a0a0a]">
              <ControlsPanel
                isPlaying={isPlaying}
                speed={speed}
                onPlayPause={handlePlayPause}
                onStep={handleStep}
                onReset={handleReset}
                onSpeedChange={setSpeed}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
