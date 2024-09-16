const barsContainer = document.getElementById('bars');
const numBars = 30;
let bars = [];
let speed = 50;  // Default speed

// Get speed from slider
document.getElementById('speed').addEventListener('input', (e) => {
    speed = 100 - e.target.value; // Inverse relationship: higher values mean slower speed
    document.getElementById('speedValue').textContent = e.target.value;
});

// Initialize bars
function initBars() {
    barsContainer.innerHTML = '';
    bars = [];
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        const height = Math.random() * 100 + 70
        bar.style.height = `${height}px`;

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = Math.round(height);

        bar.appendChild(label);
        barsContainer.appendChild(bar);
        bars.push(bar);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    const arr = bars.map(bar => parseFloat(bar.style.height));
    const len = arr.length;

    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            bars[j].classList.add('active');
            bars[j + 1].classList.add('active');
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                bars[j].style.height = `${arr[j]}px`;
                bars[j + 1].style.height = `${arr[j + 1]}px`;
                bars[j].querySelector('.bar-label').textContent = Math.round(arr[j]);
                bars[j + 1].querySelector('.bar-label').textContent = Math.round(arr[j + 1]);
            }
            await sleep(speed);
            bars[j].classList.remove('active');
            bars[j + 1].classList.remove('active');
        }
        bars[len - i - 1].classList.add('sorted');
    }
    bars[0].classList.add('sorted');
}

async function insertionSort() {
    const arr = bars.map(bar => parseFloat(bar.style.height));
    const len = arr.length;

    for (let i = 1; i < len; i++) {
        let key = arr[i];
        let j = i - 1;
        bars[i].classList.add('active');
        while (j >= 0 && arr[j] > key) {
            bars[j].classList.add('active');
            bars[j + 1].style.height = `${arr[j]}px`;
            bars[j + 1].querySelector('.bar-label').textContent = Math.round(arr[j]);
            arr[j + 1] = arr[j];
            await sleep(speed);
            bars[j].classList.remove('active');
            j--;
        }
        bars[j + 1].style.height = `${key}px`;
        bars[j + 1].querySelector('.bar-label').textContent = Math.round(key);
        arr[j + 1] = key;
        bars[i].classList.remove('active');
        bars[i].classList.add('sorted');
    }
    bars[len - 1].classList.add('sorted');
}

async function selectionSort() {
    const arr = bars.map(bar => parseFloat(bar.style.height));
    const len = arr.length;

    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        bars[i].classList.add('active');
        for (let j = i + 1; j < len; j++) {
            bars[j].classList.add('active');
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
            await sleep(speed);
            bars[j].classList.remove('active');
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            bars[i].style.height = `${arr[i]}px`;
            bars[minIndex].style.height = `${arr[minIndex]}px`;
            bars[i].querySelector('.bar-label').textContent = Math.round(arr[i]);
            bars[minIndex].querySelector('.bar-label').textContent = Math.round(arr[minIndex]);
        }
        bars[i].classList.remove('active');
        bars[i].classList.add('sorted');
    }
    bars[len - 1].classList.add('sorted');
}

async function mergeSort(arr, l, r) {
    if (l >= r) return;

    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
}

async function merge(arr, l, m, r) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
        bars[k].classList.add('active');
        bars[k + 1].classList.add('active');
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
        await sleep(speed);
        bars[k - 1].style.height = `${arr[k - 1]}px`;
        bars[k - 1].querySelector('.bar-label').textContent = Math.round(arr[k - 1]);
        bars[k].classList.remove('active');
        bars[k - 1].classList.remove('active');
    }
    while (i < left.length) {
        arr[k++] = left[i++];
        await sleep(speed);
        bars[k - 1].style.height = `${arr[k - 1]}px`;
        bars[k - 1].querySelector('.bar-label').textContent = Math.round(arr[k - 1]);
    }
    while (j < right.length) {
        arr[k++] = right[j++];
        await sleep(speed);
        bars[k - 1].style.height = `${arr[k - 1]}px`;
        bars[k - 1].querySelector('.bar-label').textContent = Math.round(arr[k - 1]);
    }
}

async function startSorting() {
    const algorithm = document.getElementById('algorithm').value;
    initBars();

    const arr = bars.map(bar => parseFloat(bar.style.height));
    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'merge':
            await mergeSort(arr, 0, arr.length - 1);
            bars.forEach(bar => {
                const index = bars.indexOf(bar);
                bar.style.height = `${arr[index]}px`;
                bar.querySelector('.bar-label').textContent = Math.round(arr[index]);
            });
            bars.forEach(bar => bar.classList.add('sorted'));
            break;
    }
    
}

function generateRandomArray() {
    initBars();
}

// Update complexity information based on the selected algorithm
function updateComplexity() {
    const algorithm = document.getElementById('algorithm').value;
    const bestTime = document.getElementById('bestTime');
    const averageTime = document.getElementById('averageTime');
    const worstTime = document.getElementById('worstTime');
    const spaceComplexity = document.getElementById('spaceComplexity');

    switch (algorithm) {
        case 'bubble':
            bestTime.textContent = 'O(n)';
            averageTime.textContent = 'O(n^2)';
            worstTime.textContent = 'O(n^2)';
            spaceComplexity.textContent = 'O(1)';
            break;
        case 'insertion':
            bestTime.textContent = 'O(n)';
            averageTime.textContent = 'O(n^2)';
            worstTime.textContent = 'O(n^2)';
            spaceComplexity.textContent = 'O(1)';
            break;
        case 'selection':
            bestTime.textContent = 'O(n^2)';
            averageTime.textContent = 'O(n^2)';
            worstTime.textContent = 'O(n^2)';
            spaceComplexity.textContent = 'O(1)';
            break;
        case 'merge':
            bestTime.textContent = 'O(n log n)';
            averageTime.textContent = 'O(n log n)';
            worstTime.textContent = 'O(n log n)';
            spaceComplexity.textContent = 'O(n)';
            break;
    }
}

// Initialize the complexities on page load
window.onload = () => {
    initBars();
    updateComplexity();
};
